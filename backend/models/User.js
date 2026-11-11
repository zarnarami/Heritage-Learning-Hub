const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  profile: {
    bio: { type: String, default: 'Passionate about Indian culture and historical heritage.' },
    institution: { type: String, default: 'Indian Heritage Academy' },
    grade: { type: String, default: 'Grade 10 / Undergraduate' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    badges: [
      {
        id: String,
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now },
        description: String,
      },
    ],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
