const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const { connectDB, getIsConnected } = require('../config/db');
const User = require('../models/User');
const Heritage = require('../models/Heritage');
const LearningModule = require('../models/LearningModule');
const Quiz = require('../models/Quiz');
const Progress = require('../models/Progress');
const Bookmark = require('../models/Bookmark');
const {
  usersData,
  heritageData,
  learningModulesData,
  quizzesData,
  progressData,
  bookmarksData,
} = require('../data/seedData');
const { initFallbackDB } = require('../services/storage');

dotenv.config();

const seedAll = async () => {
  console.log('[Seeder] Starting Heritage Learning Hub database seeding...');

  const connected = await connectDB();
  if (connected) {
    try {
      console.log('[Seeder] Purging existing MongoDB collections...');
      await User.deleteMany({});
      await Heritage.deleteMany({});
      await LearningModule.deleteMany({});
      await Quiz.deleteMany({});
      await Progress.deleteMany({});
      await Bookmark.deleteMany({});

      const salt = await bcrypt.genSalt(10);
      const hashedUsers = await Promise.all(
        usersData.map(async u => ({
          ...u,
          password: await bcrypt.hash(u.password, salt),
        }))
      );

      await User.insertMany(hashedUsers);
      await Heritage.insertMany(heritageData);
      await LearningModule.insertMany(learningModulesData);
      await Quiz.insertMany(quizzesData);
      await Progress.insertMany(progressData);
      await Bookmark.insertMany(bookmarksData);

      console.log('✅ [Seeder] MongoDB successfully seeded with authentic Indian heritage records!');
    } catch (err) {
      console.error('[Seeder] MongoDB seed failed:', err.message);
    }
  } else {
    console.log('[Seeder] Initializing standalone persistent JSON engine...');
    initFallbackDB();
    console.log('✅ [Seeder] Persistent storage initialized with authentic Indian heritage records!');
  }
};

if (require.main === module) {
  seedAll().then(() => process.exit(0));
}

module.exports = seedAll;
