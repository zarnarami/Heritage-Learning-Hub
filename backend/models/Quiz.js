const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  timeLimit: {
    type: Number,
    default: 10, // minutes
  },
  description: {
    type: String,
    default: '',
  },
  questions: [
    {
      id: { type: String, required: true },
      question: { type: String, required: true },
      options: {
        type: [String],
        validate: [val => val.length === 4, 'Must provide exactly 4 options'],
      },
      correctAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 3,
      },
      explanation: {
        type: String,
        default: '',
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
