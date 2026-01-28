const express = require('express');
const router = express.Router();
const { handleZomatoWebhook } = require('../controllers/zomatoWebhookController');

router.post('/webhook/zomato/items/:resId', handleZomatoWebhook);

module.exports = router;
