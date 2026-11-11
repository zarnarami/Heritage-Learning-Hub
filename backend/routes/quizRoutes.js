const express = require('express');
const router = express.Router();
const { getAllQuizzes, getQuizById, submitQuiz, createQuiz } = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

// Optional auth for quiz submit (to link score if logged in)
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', optionalAuth, submitQuiz);

// Teachers and Admins can create quizzes
router.post('/', protect, authorize('teacher', 'admin'), createQuiz);

module.exports = router;
