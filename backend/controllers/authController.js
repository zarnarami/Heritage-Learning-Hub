const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserRepo } = require('../services/storage');
const { JWT_SECRET } = require('../middleware/auth');

const signToken = (id, role) => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Role protection: public registration only allows student or teacher
    const assignedRole = role === 'teacher' ? 'teacher' : 'student';

    const existingUser = await UserRepo.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserRepo.create({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
      profile: {
        bio: `Enthusiastic ${assignedRole} exploring Indian heritage.`,
        institution: 'Indian Heritage Hub Academy',
        grade: assignedRole === 'student' ? 'Grade 10 / Undergraduate' : 'Faculty Member',
        avatar:
          assignedRole === 'teacher'
            ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        badges: [
          {
            id: 'b-init',
            name: 'Heritage Explorer',
            icon: 'Sparkles',
            earnedAt: new Date().toISOString(),
            description: 'Joined the National Heritage Learning Hub platform.',
          },
        ],
      },
    });

    const token = signToken(user._id, user.role);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Heritage Learning Hub.',
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await UserRepo.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account is deactivated. Contact an admin.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signToken(user._id, user.role);

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile,
    };

    res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await UserRepo.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const userObj = user.toObject ? user.toObject() : user;
    const { password, ...safeUser } = userObj;
    res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { bio, institution, grade, avatar } = req.body;

    const updatedUser = await UserRepo.findByIdAndUpdate(
      req.user._id,
      {
        profile: {
          ...req.user.profile,
          ...(bio !== undefined && { bio }),
          ...(institution !== undefined && { institution }),
          ...(grade !== undefined && { grade }),
          ...(avatar !== undefined && { avatar }),
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
