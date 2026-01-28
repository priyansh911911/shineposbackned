const express = require('express');
const router = express.Router();
const { getItems, updateCategoryStatus, updateItemStatus } = require('../controllers/zomatoWebhookController');

// Items endpoints
router.get('/:resId/items', getItems);

// Category status
router.post('/:resId/categories/status', updateCategoryStatus);

// Item status
router.post('/:resId/items/status', updateItemStatus);

module.exports = router;
