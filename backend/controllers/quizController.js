const { QuizRepo, ProgressRepo, UserRepo } = require('../services/storage');

// @route   GET /api/quizzes
// @access  Public
const getAllQuizzes = async (req, res, next) => {
  try {
    const { category, difficulty } = req.query;
    let quizzes = await QuizRepo.find();

    if (category && category !== 'All') {
      quizzes = quizzes.filter(q => q.category === category);
    }
    if (difficulty && difficulty !== 'All') {
      quizzes = quizzes.filter(q => q.difficulty === difficulty);
    }

    const sanitized = quizzes.map(q => ({
      _id: q._id,
      title: q.title,
      category: q.category,
      difficulty: q.difficulty,
      timeLimit: q.timeLimit,
      description: q.description,
      questionsCount: q.questions ? q.questions.length : 0,
      createdAt: q.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: sanitized.length,
      data: sanitized,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/quizzes/:id
// @access  Public
const getQuizById = async (req, res, next) => {
  try {
    const quiz = await QuizRepo.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    // Return questions with options for taking the test
    const sanitizedQuestions = quiz.questions.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    res.status(200).json({
      success: true,
      data: {
        _id: quiz._id,
        title: quiz.title,
        category: quiz.category,
        difficulty: quiz.difficulty,
        timeLimit: quiz.timeLimit,
        description: quiz.description,
        totalQuestions: quiz.questions.length,
        questions: sanitizedQuestions,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/quizzes/:id/submit
// @access  Private (or Public with optional user saving)
const submitQuiz = async (req, res, next) => {
  try {
    const quiz = await QuizRepo.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    const { answers } = req.body; // Array of { questionId, selectedAnswer }
    const answersMap = {};
    if (Array.isArray(answers)) {
      answers.forEach(a => {
        answersMap[a.questionId] = a.selectedAnswer;
      });
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;
    const detailedResults = quiz.questions.map(q => {
      const selected = answersMap[q.id];
      const isCorrect = selected !== undefined && Number(selected) === q.correctAnswer;
      if (isCorrect) score += 1;

      return {
        questionId: q.id,
        question: q.question,
        options: q.options,
        selectedAnswer: selected !== undefined ? Number(selected) : null,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation || '',
      };
    });

    const percentage = Math.round((score / totalQuestions) * 100);

    // If authenticated, persist progress
    if (req.user) {
      await ProgressRepo.findOneAndUpdate(
        { userId: req.user._id },
        {
          $push: {
            quizScores: {
              quizId: quiz._id,
              quizTitle: quiz.title,
              score,
              totalQuestions,
              percentage,
              difficulty: quiz.difficulty,
              completedAt: new Date().toISOString(),
            },
          },
        }
      );

      // Check for award badge if 100%
      if (percentage === 100) {
        const currentUser = await UserRepo.findById(req.user._id);
        const hasBadge = currentUser?.profile?.badges?.some(b => b.name === 'Perfect Score Master');
        if (!hasBadge && currentUser) {
          await UserRepo.findByIdAndUpdate(req.user._id, {
            profile: {
              ...currentUser.profile,
              badges: [
                ...(currentUser.profile.badges || []),
                {
                  id: `badge-${Date.now()}`,
                  name: 'Perfect Score Master',
                  icon: 'Award',
                  earnedAt: new Date().toISOString(),
                  description: `Scored 100% in ${quiz.title}!`,
                },
              ],
            },
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        quizId: quiz._id,
        quizTitle: quiz.title,
        score,
        totalQuestions,
        percentage,
        passed: percentage >= 60,
        detailedResults,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/quizzes
// @access  Private (Teacher or Admin)
const createQuiz = async (req, res, next) => {
  try {
    const { title, category, difficulty, timeLimit, description, questions } = req.body;

    if (!title || !category || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, and at least one question with 4 options.',
      });
    }

    const newQuiz = await QuizRepo.create({
      title,
      category,
      difficulty: difficulty || 'Medium',
      timeLimit: Number(timeLimit) || 10,
      description: description || '',
      questions,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully.',
      data: newQuiz,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllQuizzes,
  getQuizById,
  submitQuiz,
  createQuiz,
};
