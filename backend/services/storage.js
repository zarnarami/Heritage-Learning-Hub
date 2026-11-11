const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { getIsConnected } = require('../config/db');
const UserMongoose = require('../models/User');
const HeritageMongoose = require('../models/Heritage');
const LearningModuleMongoose = require('../models/LearningModule');
const QuizMongoose = require('../models/Quiz');
const ProgressMongoose = require('../models/Progress');
const BookmarkMongoose = require('../models/Bookmark');
const {
  usersData,
  heritageData,
  learningModulesData,
  quizzesData,
  progressData,
  bookmarksData,
} = require('../data/seedData');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

// In-memory cache when running in fallback mode
let memoryDb = null;

const initFallbackDB = () => {
  if (memoryDb) return memoryDb;

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      memoryDb = JSON.parse(raw);
      console.log('[Storage Engine] Loaded persisted dataset from backend/data/db.json');
      return memoryDb;
    } catch (e) {
      console.warn('[Storage Engine] Failed reading db.json, re-initializing from seeds...');
    }
  }

  // Hash seed passwords
  const salt = bcrypt.genSaltSync(10);
  const preparedUsers = usersData.map(u => ({
    ...u,
    password: u.password.startsWith('$2a$') ? u.password : bcrypt.hashSync(u.password, salt),
    createdAt: u.createdAt || new Date().toISOString(),
  }));

  memoryDb = {
    users: preparedUsers,
    heritage: JSON.parse(JSON.stringify(heritageData)),
    modules: JSON.parse(JSON.stringify(learningModulesData)),
    quizzes: JSON.parse(JSON.stringify(quizzesData)),
    progress: JSON.parse(JSON.stringify(progressData)),
    bookmarks: JSON.parse(JSON.stringify(bookmarksData)),
  };

  saveFallbackDB();
  return memoryDb;
};

const saveFallbackDB = () => {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDb, null, 2), 'utf8');
  } catch (err) {
    console.error('[Storage Engine] Error saving db.json:', err.message);
  }
};

// Generate 24-char hex id like MongoDB ObjectId
const generateId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomChars = Math.random().toString(16).substring(2, 18).padEnd(16, '0');
  return (timestamp + randomChars).substring(0, 24);
};

// --- DATA ACCESS LAYER ---

const UserRepo = {
  find: async (query = {}) => {
    if (getIsConnected()) {
      return await UserMongoose.find(query).select('-password');
    }
    const db = initFallbackDB();
    return db.users
      .filter(u => {
        if (query.role && u.role !== query.role) return false;
        if (query.email && u.email.toLowerCase() !== query.email.toLowerCase()) return false;
        return true;
      })
      .map(({ password, ...rest }) => rest);
  },

  findOne: async query => {
    if (getIsConnected()) {
      return await UserMongoose.findOne(query);
    }
    const db = initFallbackDB();
    if (query.email) {
      return db.users.find(u => u.email.toLowerCase() === query.email.toLowerCase()) || null;
    }
    if (query._id) {
      return db.users.find(u => String(u._id) === String(query._id)) || null;
    }
    return null;
  },

  findById: async id => {
    if (getIsConnected()) {
      return await UserMongoose.findById(id);
    }
    const db = initFallbackDB();
    return db.users.find(u => String(u._id) === String(id)) || null;
  },

  create: async userData => {
    if (getIsConnected()) {
      return await UserMongoose.create(userData);
    }
    const db = initFallbackDB();
    const newUser = {
      _id: userData._id || generateId(),
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'student',
      profile: userData.profile || {
        bio: 'Explorer of Indian heritage.',
        institution: '',
        grade: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        badges: [],
      },
      isActive: userData.isActive !== undefined ? userData.isActive : true,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    saveFallbackDB();
    return newUser;
  },

  findByIdAndUpdate: async (id, update, options = {}) => {
    if (getIsConnected()) {
      return await UserMongoose.findByIdAndUpdate(id, update, { new: true, ...options }).select('-password');
    }
    const db = initFallbackDB();
    const index = db.users.findIndex(u => String(u._id) === String(id));
    if (index === -1) return null;

    db.users[index] = {
      ...db.users[index],
      ...update,
      profile: {
        ...db.users[index].profile,
        ...(update.profile || {}),
      },
    };
    saveFallbackDB();
    const { password, ...safeUser } = db.users[index];
    return safeUser;
  },

  countDocuments: async (query = {}) => {
    if (getIsConnected()) {
      return await UserMongoose.countDocuments(query);
    }
    const db = initFallbackDB();
    if (query.role) {
      return db.users.filter(u => u.role === query.role).length;
    }
    return db.users.length;
  },
};

const HeritageRepo = {
  find: async (query = {}, options = {}) => {
    if (getIsConnected()) {
      let q = HeritageMongoose.find();
      if (query.search) {
        q = q.find({
          $or: [
            { name: { $regex: query.search, $options: 'i' } },
            { location: { $regex: query.search, $options: 'i' } },
            { state: { $regex: query.search, $options: 'i' } },
            { description: { $regex: query.search, $options: 'i' } },
          ],
        });
      }
      if (query.category && query.category !== 'All') {
        q = q.find({ category: query.category });
      }
      if (query.state && query.state !== 'All') {
        q = q.find({ state: query.state });
      }
      if (options.sort) q = q.sort(options.sort);
      if (options.skip) q = q.skip(options.skip);
      if (options.limit) q = q.limit(options.limit);
      return await q.exec();
    }

    const db = initFallbackDB();
    let results = [...db.heritage];

    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term) ||
          item.state.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term)
      );
    }
    if (query.category && query.category !== 'All') {
      results = results.filter(item => item.category === query.category);
    }
    if (query.state && query.state !== 'All') {
      results = results.filter(item => item.state === query.state);
    }

    if (options.sort) {
      if (options.sort.viewsCount === -1) {
        results.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
      } else if (options.sort.name === 1) {
        results.sort((a, b) => a.name.localeCompare(b.name));
      } else if (options.sort.createdAt === -1) {
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    }

    const start = options.skip || 0;
    const limit = options.limit ? start + options.limit : results.length;
    return results.slice(start, limit);
  },

  countDocuments: async (query = {}) => {
    if (getIsConnected()) {
      let q = HeritageMongoose.find();
      if (query.search) {
        q = q.find({
          $or: [
            { name: { $regex: query.search, $options: 'i' } },
            { location: { $regex: query.search, $options: 'i' } },
            { state: { $regex: query.search, $options: 'i' } },
          ],
        });
      }
      if (query.category && query.category !== 'All') {
        q = q.find({ category: query.category });
      }
      if (query.state && query.state !== 'All') {
        q = q.find({ state: query.state });
      }
      return await q.countDocuments();
    }

    const db = initFallbackDB();
    let results = [...db.heritage];
    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        item =>
          item.name.toLowerCase().includes(term) ||
          item.location.toLowerCase().includes(term) ||
          item.state.toLowerCase().includes(term)
      );
    }
    if (query.category && query.category !== 'All') {
      results = results.filter(item => item.category === query.category);
    }
    if (query.state && query.state !== 'All') {
      results = results.filter(item => item.state === query.state);
    }
    return results.length;
  },

  findById: async id => {
    if (getIsConnected()) {
      return await HeritageMongoose.findById(id);
    }
    const db = initFallbackDB();
    return db.heritage.find(item => String(item._id) === String(id)) || null;
  },

  create: async item => {
    if (getIsConnected()) {
      return await HeritageMongoose.create(item);
    }
    const db = initFallbackDB();
    const newItem = {
      _id: item._id || generateId(),
      ...item,
      viewsCount: item.viewsCount || 0,
      createdAt: new Date().toISOString(),
    };
    db.heritage.push(newItem);
    saveFallbackDB();
    return newItem;
  },

  findByIdAndUpdate: async (id, update, options = {}) => {
    if (getIsConnected()) {
      return await HeritageMongoose.findByIdAndUpdate(id, update, { new: true, ...options });
    }
    const db = initFallbackDB();
    const index = db.heritage.findIndex(item => String(item._id) === String(id));
    if (index === -1) return null;

    db.heritage[index] = {
      ...db.heritage[index],
      ...update,
    };
    saveFallbackDB();
    return db.heritage[index];
  },

  findByIdAndDelete: async id => {
    if (getIsConnected()) {
      return await HeritageMongoose.findByIdAndDelete(id);
    }
    const db = initFallbackDB();
    const index = db.heritage.findIndex(item => String(item._id) === String(id));
    if (index === -1) return null;
    const deleted = db.heritage.splice(index, 1)[0];
    saveFallbackDB();
    return deleted;
  },
};

const LearningModuleRepo = {
  find: async (query = {}) => {
    if (getIsConnected()) {
      return await LearningModuleMongoose.find(query);
    }
    const db = initFallbackDB();
    let res = [...db.modules];
    if (query.category) res = res.filter(m => m.category === query.category);
    if (query.level) res = res.filter(m => m.level === query.level);
    return res;
  },

  findById: async id => {
    if (getIsConnected()) {
      return await LearningModuleMongoose.findById(id);
    }
    const db = initFallbackDB();
    return db.modules.find(m => String(m._id) === String(id)) || null;
  },

  create: async modData => {
    if (getIsConnected()) {
      return await LearningModuleMongoose.create(modData);
    }
    const db = initFallbackDB();
    const newMod = {
      _id: modData._id || generateId(),
      ...modData,
      createdAt: new Date().toISOString(),
    };
    db.modules.push(newMod);
    saveFallbackDB();
    return newMod;
  },

  countDocuments: async () => {
    if (getIsConnected()) {
      return await LearningModuleMongoose.countDocuments();
    }
    const db = initFallbackDB();
    return db.modules.length;
  },
};

const QuizRepo = {
  find: async (query = {}) => {
    if (getIsConnected()) {
      return await QuizMongoose.find(query);
    }
    const db = initFallbackDB();
    let res = [...db.quizzes];
    if (query.category) res = res.filter(q => q.category === query.category);
    if (query.difficulty) res = res.filter(q => q.difficulty === query.difficulty);
    return res;
  },

  findById: async id => {
    if (getIsConnected()) {
      return await QuizMongoose.findById(id);
    }
    const db = initFallbackDB();
    return db.quizzes.find(q => String(q._id) === String(id)) || null;
  },

  create: async quizData => {
    if (getIsConnected()) {
      return await QuizMongoose.create(quizData);
    }
    const db = initFallbackDB();
    const newQuiz = {
      _id: quizData._id || generateId(),
      ...quizData,
      createdAt: new Date().toISOString(),
    };
    db.quizzes.push(newQuiz);
    saveFallbackDB();
    return newQuiz;
  },

  countDocuments: async () => {
    if (getIsConnected()) {
      return await QuizMongoose.countDocuments();
    }
    const db = initFallbackDB();
    return db.quizzes.length;
  },
};

const ProgressRepo = {
  findOne: async query => {
    if (getIsConnected()) {
      return await ProgressMongoose.findOne(query);
    }
    const db = initFallbackDB();
    return db.progress.find(p => String(p.userId) === String(query.userId)) || null;
  },

  findOneAndUpdate: async (query, update, options = {}) => {
    if (getIsConnected()) {
      return await ProgressMongoose.findOneAndUpdate(query, update, { new: true, upsert: true, ...options });
    }
    const db = initFallbackDB();
    let prog = db.progress.find(p => String(p.userId) === String(query.userId));
    if (!prog) {
      prog = {
        _id: generateId(),
        userId: query.userId,
        completedModules: [],
        quizScores: [],
        recentlyViewed: [],
        lastAccessed: new Date().toISOString(),
      };
      db.progress.push(prog);
    }

    if (update.$push) {
      if (update.$push.quizScores) {
        prog.quizScores.push(update.$push.quizScores);
      }
      if (update.$push.completedModules) {
        prog.completedModules.push(update.$push.completedModules);
      }
      if (update.$push.recentlyViewed) {
        // Keep unique by heritageId
        prog.recentlyViewed = prog.recentlyViewed.filter(
          r => String(r.heritageId) !== String(update.$push.recentlyViewed.heritageId)
        );
        prog.recentlyViewed.unshift(update.$push.recentlyViewed);
        if (prog.recentlyViewed.length > 8) prog.recentlyViewed.pop();
      }
    }

    if (update.$set) {
      Object.assign(prog, update.$set);
    }
    prog.lastAccessed = new Date().toISOString();

    saveFallbackDB();
    return prog;
  },

  find: async () => {
    if (getIsConnected()) {
      return await ProgressMongoose.find();
    }
    const db = initFallbackDB();
    return db.progress;
  },
};

const BookmarkRepo = {
  find: async query => {
    if (getIsConnected()) {
      return await BookmarkMongoose.find(query).populate('heritageId');
    }
    const db = initFallbackDB();
    const userBookmarks = db.bookmarks.filter(b => String(b.userId) === String(query.userId));
    // Populate heritage details
    return userBookmarks.map(b => ({
      ...b,
      heritageId: db.heritage.find(h => String(h._id) === String(b.heritageId)) || null,
    }));
  },

  findOne: async query => {
    if (getIsConnected()) {
      return await BookmarkMongoose.findOne(query);
    }
    const db = initFallbackDB();
    return (
      db.bookmarks.find(
        b => String(b.userId) === String(query.userId) && String(b.heritageId) === String(query.heritageId)
      ) || null
    );
  },

  create: async bookmarkData => {
    if (getIsConnected()) {
      return await BookmarkMongoose.create(bookmarkData);
    }
    const db = initFallbackDB();
    const exists = db.bookmarks.some(
      b => String(b.userId) === String(bookmarkData.userId) && String(b.heritageId) === String(bookmarkData.heritageId)
    );
    if (exists) return null;

    const newBookmark = {
      _id: bookmarkData._id || generateId(),
      userId: bookmarkData.userId,
      heritageId: bookmarkData.heritageId,
      createdAt: new Date().toISOString(),
    };
    db.bookmarks.push(newBookmark);
    saveFallbackDB();
    return newBookmark;
  },

  findOneAndDelete: async query => {
    if (getIsConnected()) {
      return await BookmarkMongoose.findOneAndDelete(query);
    }
    const db = initFallbackDB();
    const index = db.bookmarks.findIndex(
      b => String(b.userId) === String(query.userId) && String(b.heritageId) === String(query.heritageId)
    );
    if (index === -1) return null;
    const removed = db.bookmarks.splice(index, 1)[0];
    saveFallbackDB();
    return removed;
  },

  countDocuments: async () => {
    if (getIsConnected()) {
      return await BookmarkMongoose.countDocuments();
    }
    const db = initFallbackDB();
    return db.bookmarks.length;
  },
};

module.exports = {
  initFallbackDB,
  UserRepo,
  HeritageRepo,
  LearningModuleRepo,
  QuizRepo,
  ProgressRepo,
  BookmarkRepo,
};
