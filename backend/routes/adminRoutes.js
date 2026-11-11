const express = require('express');
const router = express.Router();
const {
  getAdminDashboardStats,
  getAllUsers,
  updateUserByAdmin,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserByAdmin);

module.exports = router;
