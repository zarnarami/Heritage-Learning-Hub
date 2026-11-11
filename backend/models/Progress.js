const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  completedModules: [
    {
      moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningModule' },
      moduleTitle: String,
      completedAt: { type: Date, default: Date.now },
      score: { type: Number, default: 100 },
    },
  ],
  quizScores: [
    {
      quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
      quizTitle: String,
      score: { type: Number, required: true },
      totalQuestions: { type: Number, required: true },
      percentage: { type: Number, required: true },
      difficulty: { type: String, default: 'Medium' },
      completedAt: { type: Date, default: Date.now },
    },
  ],
  recentlyViewed: [
    {
      heritageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Heritage' },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Progress || mongoose.model('Progress', progressSchema);
