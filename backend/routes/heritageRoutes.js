const express = require('express');
const router = express.Router();
const {
  getAllHeritage,
  getHeritageById,
  createHeritage,
  updateHeritage,
  deleteHeritage,
  getFilterOptions,
} = require('../controllers/heritageController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllHeritage);
router.get('/meta/filters', getFilterOptions);
router.get('/:id', getHeritageById);

// Admin-only endpoints
router.post('/', protect, authorize('admin'), createHeritage);
router.put('/:id', protect, authorize('admin'), updateHeritage);
router.delete('/:id', protect, authorize('admin'), deleteHeritage);

module.exports = router;
