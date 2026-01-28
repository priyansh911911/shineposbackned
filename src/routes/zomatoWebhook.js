const express = require('express');
const router = express.Router();
const { handleZomatoWebhook } = require('../controllers/zomatoWebhookController');

router.post('/webhook/zomato/items/:resId', handleZomatoWebhook);
router.get('/webhook/zomato/:resId/items', (req, res) => {
  res.json({ message: 'Webhook endpoint ready', resId: req.params.resId });
});

module.exports = router;
