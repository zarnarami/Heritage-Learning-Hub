const { ProgressRepo, HeritageRepo, LearningModuleRepo } = require('../services/storage');

// @route   GET /api/progress
// @access  Private
const getUserProgress = async (req, res, next) => {
  try {
    const progress = (await ProgressRepo.findOne({ userId: req.user._id })) || {
      completedModules: [],
      quizScores: [],
      recentlyViewed: [],
    };

    // Populate recently viewed heritage details
    const populatedRecent = [];
    if (Array.isArray(progress.recentlyViewed)) {
      for (const item of progress.recentlyViewed) {
        const h = await HeritageRepo.findById(item.heritageId);
        if (h) {
          populatedRecent.push({
            heritageId: h._id,
            name: h.name,
            category: h.category,
            state: h.state,
            image: h.images?.[0] || '',
            viewedAt: item.viewedAt,
          });
        }
      }
    }

    const totalQuizzes = progress.quizScores ? progress.quizScores.length : 0;
    const avgScore =
      totalQuizzes > 0
        ? Math.round(progress.quizScores.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / totalQuizzes)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        completedModules: progress.completedModules || [],
        quizScores: progress.quizScores || [],
        recentlyViewed: populatedRecent,
        stats: {
          totalModulesCompleted: progress.completedModules?.length || 0,
          totalQuizzesTaken: totalQuizzes,
          averageQuizScore: avgScore,
          earnedBadgesCount: req.user.profile?.badges?.length || 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/progress/recent-view
// @access  Private
const addRecentlyViewed = async (req, res, next) => {
  try {
    const { heritageId } = req.body;
    if (!heritageId) {
      return res.status(400).json({ success: false, message: 'heritageId is required.' });
    }

    await ProgressRepo.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          recentlyViewed: {
            heritageId,
            viewedAt: new Date().toISOString(),
          },
        },
      }
    );

    res.status(200).json({ success: true, message: 'Recorded in recently viewed.' });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/progress/complete-module
// @access  Private
const completeModule = async (req, res, next) => {
  try {
    const { moduleId } = req.body;
    if (!moduleId) {
      return res.status(400).json({ success: false, message: 'moduleId is required.' });
    }

    const mod = await LearningModuleRepo.findById(moduleId);
    if (!mod) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    const updated = await ProgressRepo.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          completedModules: {
            moduleId: mod._id,
            moduleTitle: mod.title,
            completedAt: new Date().toISOString(),
            score: 100,
          },
        },
      }
    );

    res.status(200).json({
      success: true,
      message: `Congratulations! You completed '${mod.title}'.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProgress,
  addRecentlyViewed,
  completeModule,
};
