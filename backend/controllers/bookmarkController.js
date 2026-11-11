const { BookmarkRepo, HeritageRepo } = require('../services/storage');

// @route   GET /api/bookmarks
// @access  Private
const getUserBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await BookmarkRepo.find({ userId: req.user._id });
    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/bookmarks
// @access  Private
const addBookmark = async (req, res, next) => {
  try {
    const { heritageId } = req.body;
    if (!heritageId) {
      return res.status(400).json({ success: false, message: 'heritageId is required.' });
    }

    const heritage = await HeritageRepo.findById(heritageId);
    if (!heritage) {
      return res.status(404).json({ success: false, message: 'Heritage item not found.' });
    }

    const existing = await BookmarkRepo.findOne({
      userId: req.user._id,
      heritageId,
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Item is already bookmarked.' });
    }

    const bookmark = await BookmarkRepo.create({
      userId: req.user._id,
      heritageId,
    });

    res.status(201).json({
      success: true,
      message: 'Heritage item bookmarked.',
      data: bookmark,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/bookmarks/:heritageId
// @access  Private
const removeBookmark = async (req, res, next) => {
  try {
    const { heritageId } = req.params;

    const removed = await BookmarkRepo.findOneAndDelete({
      userId: req.user._id,
      heritageId,
    });

    if (!removed) {
      return res.status(404).json({ success: false, message: 'Bookmark not found.' });
    }

    res.status(200).json({
      success: true,
      message: 'Bookmark removed.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserBookmarks,
  addBookmark,
  removeBookmark,
};
