const mongoose = require('mongoose');

const learningModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  duration: {
    type: String,
    default: '45 mins',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  lessons: [
    {
      id: { type: String, required: true },
      title: { type: String, required: true },
      summary: { type: String, default: '' },
      content: { type: String, required: true },
      readingTime: { type: String, default: '10 mins' },
      keyTakeaways: [String],
    },
  ],
  pdfResources: [
    {
      title: { type: String, required: true },
      fileSize: { type: String, default: '2.4 MB' },
      downloadUrl: { type: String, required: true },
      description: { type: String, default: '' },
    },
  ],
  videoResources: [
    {
      title: { type: String, required: true },
      duration: { type: String, default: '15 mins' },
      videoUrl: { type: String, required: true },
      source: { type: String, default: 'Ministry of Culture / ASI Archive' },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.LearningModule || mongoose.model('LearningModule', learningModuleSchema);
