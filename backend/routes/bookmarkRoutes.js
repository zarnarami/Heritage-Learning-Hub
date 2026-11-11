const express = require('express');
const router = express.Router();
const {
  getUserBookmarks,
  addBookmark,
  removeBookmark,
} = require('../controllers/bookmarkController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getUserBookmarks);
router.post('/', protect, addBookmark);
router.delete('/:heritageId', protect, removeBookmark);

module.exports = router;
