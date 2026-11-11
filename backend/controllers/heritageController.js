const { HeritageRepo } = require('../services/storage');

// @route   GET /api/heritage
// @access  Public
const getAllHeritage = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) query.search = req.query.search.trim();
    if (req.query.category && req.query.category !== 'All') query.category = req.query.category;
    if (req.query.state && req.query.state !== 'All') query.state = req.query.state;

    let sort = { createdAt: -1 };
    if (req.query.sort === 'popular') sort = { viewsCount: -1 };
    if (req.query.sort === 'name') sort = { name: 1 };
    if (req.query.sort === 'oldest') sort = { createdAt: 1 };

    const total = await HeritageRepo.countDocuments(query);
    const heritageItems = await HeritageRepo.find(query, { skip, limit, sort });

    res.status(200).json({
      success: true,
      count: heritageItems.length,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      data: heritageItems,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/heritage/:id
// @access  Public
const getHeritageById = async (req, res, next) => {
  try {
    const item = await HeritageRepo.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Heritage item not found.' });
    }

    // Increment view count
    await HeritageRepo.findByIdAndUpdate(req.params.id, {
      viewsCount: (item.viewsCount || 0) + 1,
    });

    // Find related items by category
    const related = await HeritageRepo.find({ category: item.category }, { limit: 3 });
    const filteredRelated = related.filter(r => String(r._id) !== String(item._id));

    res.status(200).json({
      success: true,
      data: item,
      related: filteredRelated,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/heritage
// @access  Private (Admin only)
const createHeritage = async (req, res, next) => {
  try {
    const {
      name,
      category,
      state,
      location,
      description,
      historicalPeriod,
      culturalSignificance,
      architecturalDetails,
      importantFacts,
      images,
      videoLinks,
      sourceReferences,
      featured,
    } = req.body;

    if (!name || !category || !state || !location || !description || !historicalPeriod || !culturalSignificance) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, category, state, location, description, historicalPeriod, culturalSignificance.',
      });
    }

    const newItem = await HeritageRepo.create({
      name,
      category,
      state,
      location,
      description,
      historicalPeriod,
      culturalSignificance,
      architecturalDetails: architecturalDetails || '',
      importantFacts: Array.isArray(importantFacts)
        ? importantFacts
        : typeof importantFacts === 'string'
        ? importantFacts.split('\n').filter(Boolean)
        : [],
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'],
      videoLinks: Array.isArray(videoLinks) ? videoLinks : [],
      sourceReferences: Array.isArray(sourceReferences) && sourceReferences.length > 0
        ? sourceReferences
        : [{ title: 'Incredible India / ASI Heritage Record', url: 'https://asi.nic.in', organization: 'Archaeological Survey of India' }],
      featured: Boolean(featured),
    });

    res.status(201).json({
      success: true,
      message: 'Heritage record created successfully with official source attribution.',
      data: newItem,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/heritage/:id
// @access  Private (Admin only)
const updateHeritage = async (req, res, next) => {
  try {
    const existing = await HeritageRepo.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Heritage item not found.' });
    }

    const updated = await HeritageRepo.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({
      success: true,
      message: 'Heritage record updated successfully.',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/heritage/:id
// @access  Private (Admin only)
const deleteHeritage = async (req, res, next) => {
  try {
    const item = await HeritageRepo.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Heritage item not found.' });
    }

    await HeritageRepo.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Heritage record deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/heritage/meta/filters
// @access  Public
const getFilterOptions = async (req, res, next) => {
  try {
    const all = await HeritageRepo.find();
    const categories = Array.from(new Set(all.map(item => item.category))).filter(Boolean);
    const states = Array.from(new Set(all.map(item => item.state))).filter(Boolean).sort();

    res.status(200).json({
      success: true,
      data: {
        categories: ['All', ...categories],
        states: ['All', ...states],
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllHeritage,
  getHeritageById,
  createHeritage,
  updateHeritage,
  deleteHeritage,
  getFilterOptions,
};
