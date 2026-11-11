const express = require('express');
const router = express.Router();
const {
  getUserProgress,
  addRecentlyViewed,
  completeModule,
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUserProgress);
router.post('/recent-view', protect, addRecentlyViewed);
router.post('/complete-module', protect, completeModule);

module.exports = router;
