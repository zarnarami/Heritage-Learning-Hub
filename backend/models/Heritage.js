const mongoose = require('mongoose');

const heritageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Heritage name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Monuments',
      'Festivals',
      'Traditions',
      'Art and Crafts',
      'Architecture',
      'Historical Events',
      'UNESCO Heritage Sites',
    ],
  },
  state: {
    type: String,
    required: [true, 'Indian state is required'],
    trim: true,
  },
  location: {
    type: String,
    required: [true, 'Location/City is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Detailed description is required'],
  },
  historicalPeriod: {
    type: String,
    required: [true, 'Historical time period is required'],
  },
  culturalSignificance: {
    type: String,
    required: [true, 'Cultural significance is required'],
  },
  architecturalDetails: {
    type: String,
    default: '',
  },
  importantFacts: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  videoLinks: {
    type: [String],
    default: [],
  },
  sourceReferences: [
    {
      title: { type: String, required: true },
      url: { type: String, required: true },
      organization: { type: String, required: true },
    },
  ],
  featured: {
    type: Boolean,
    default: false,
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

heritageSchema.index({ name: 'text', description: 'text', state: 'text', location: 'text' });

module.exports = mongoose.models.Heritage || mongoose.model('Heritage', heritageSchema);
