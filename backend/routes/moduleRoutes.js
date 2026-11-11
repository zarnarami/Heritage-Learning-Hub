const express = require('express');
const router = express.Router();
const { getAllModules, getModuleById, createModule } = require('../controllers/moduleController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllModules);
router.get('/:id', getModuleById);

// Teachers and Admins can create learning modules
router.post('/', protect, authorize('teacher', 'admin'), createModule);

module.exports = router;
