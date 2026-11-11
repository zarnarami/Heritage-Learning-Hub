const {
  UserRepo,
  HeritageRepo,
  LearningModuleRepo,
  QuizRepo,
  ProgressRepo,
  BookmarkRepo,
} = require('../services/storage');

// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getAdminDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await UserRepo.countDocuments();
    const totalStudents = await UserRepo.countDocuments({ role: 'student' });
    const totalTeachers = await UserRepo.countDocuments({ role: 'teacher' });
    const totalHeritage = await HeritageRepo.countDocuments();
    const totalModules = await LearningModuleRepo.countDocuments();
    const totalQuizzes = await QuizRepo.countDocuments();
    const totalBookmarks = await BookmarkRepo.countDocuments();

    // Category breakdown
    const allHeritage = await HeritageRepo.find();
    const categoryCounts = {};
    const stateCounts = {};

    allHeritage.forEach(item => {
      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
      stateCounts[item.state] = (stateCounts[item.state] || 0) + 1;
    });

    const categoryData = Object.keys(categoryCounts).map(cat => ({
      name: cat,
      count: categoryCounts[cat],
    }));

    const stateData = Object.keys(stateCounts)
      .map(st => ({
        name: st,
        count: stateCounts[st],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);

    // Quiz analytics
    const allProgress = await ProgressRepo.find();
    let totalQuizzesAttempted = 0;
    let totalPercentageSum = 0;

    allProgress.forEach(p => {
      if (Array.isArray(p.quizScores)) {
        p.quizScores.forEach(qs => {
          totalQuizzesAttempted += 1;
          totalPercentageSum += qs.percentage || 0;
        });
      }
    });

    const averageQuizScore =
      totalQuizzesAttempted > 0 ? Math.round(totalPercentageSum / totalQuizzesAttempted) : 0;

    // Recent users
    const allUsers = await UserRepo.find();
    const recentUsers = allUsers
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(u => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
      }));

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalUsers,
          totalStudents,
          totalTeachers,
          totalHeritage,
          totalModules,
          totalQuizzes,
          totalBookmarks,
          totalQuizzesAttempted,
          averageQuizScore,
        },
        categoryData,
        stateData,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search } = req.query;
    let users = await UserRepo.find();

    if (role && role !== 'All') {
      users = users.filter(u => u.role === role);
    }

    if (search) {
      const term = search.toLowerCase();
      users = users.filter(
        u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
      );
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/admin/users/:id
// @access  Private (Admin only)
const updateUserByAdmin = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const targetUser = await UserRepo.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Prevent deactivating own admin account accidentally
    if (String(req.user._id) === String(targetUser._id) && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Security protection: You cannot deactivate your own current admin account.',
      });
    }

    const updates = {};
    if (role && ['student', 'teacher', 'admin'].includes(role)) {
      updates.role = role;
    }
    if (typeof isActive === 'boolean') {
      updates.isActive = isActive;
    }

    const updatedUser = await UserRepo.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.status(200).json({
      success: true,
      message: `User '${updatedUser.name}' updated successfully.`,
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminDashboardStats,
  getAllUsers,
  updateUserByAdmin,
};
