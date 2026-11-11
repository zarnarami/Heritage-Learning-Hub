const { LearningModuleRepo } = require('../services/storage');

// @route   GET /api/modules
// @access  Public
const getAllModules = async (req, res, next) => {
  try {
    const { category, level, search } = req.query;
    let modules = await LearningModuleRepo.find();

    if (category && category !== 'All') {
      modules = modules.filter(m => m.category === category);
    }
    if (level && level !== 'All') {
      modules = modules.filter(m => m.level === level);
    }
    if (search) {
      const term = search.toLowerCase();
      modules = modules.filter(
        m =>
          m.title.toLowerCase().includes(term) ||
          m.description.toLowerCase().includes(term) ||
          m.category.toLowerCase().includes(term)
      );
    }

    res.status(200).json({
      success: true,
      count: modules.length,
      data: modules,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/modules/:id
// @access  Public
const getModuleById = async (req, res, next) => {
  try {
    const moduleItem = await LearningModuleRepo.findById(req.params.id);
    if (!moduleItem) {
      return res.status(404).json({ success: false, message: 'Learning module not found.' });
    }

    res.status(200).json({
      success: true,
      data: moduleItem,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/modules
// @access  Private (Teacher or Admin)
const createModule = async (req, res, next) => {
  try {
    const { title, category, description, level, duration, thumbnail, lessons, pdfResources, videoResources } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide module title, category, and description.',
      });
    }

    const newModule = await LearningModuleRepo.create({
      title,
      category,
      description,
      level: level || 'Beginner',
      duration: duration || '45 mins',
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=600&q=80',
      lessons: Array.isArray(lessons) ? lessons : [],
      pdfResources: Array.isArray(pdfResources) ? pdfResources : [],
      videoResources: Array.isArray(videoResources) ? videoResources : [],
    });

    res.status(201).json({
      success: true,
      message: 'Learning module created successfully.',
      data: newModule,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllModules,
  getModuleById,
  createModule,
};
