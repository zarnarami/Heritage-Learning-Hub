const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  heritageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Heritage',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bookmarkSchema.index({ userId: 1, heritageId: 1 }, { unique: true });

module.exports = mongoose.models.Bookmark || mongoose.model('Bookmark', bookmarkSchema);
