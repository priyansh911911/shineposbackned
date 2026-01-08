const express = require('express');
const { getSystemHealth, getHealthHistory } = require('../controllers/systemController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get current system health
router.get('/all/system/health', auth(['SUPER_ADMIN']), getSystemHealth);

// Get health history
router.get('/all/health/history', auth(['SUPER_ADMIN']), getHealthHistory);

module.exports = router;