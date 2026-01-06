const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// GET /api/subscriptions/:restaurantId - Get subscription by restaurant
router.get('/:restaurantId', async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ restaurantId: req.params.restaurantId });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/subscriptions - Create subscription
router.post('/', async (req, res) => {
  try {
    const subscription = new Subscription(req.body);
    await subscription.save();
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/subscriptions/:restaurantId - Update subscription
router.put('/:restaurantId', async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { restaurantId: req.params.restaurantId },
      req.body,
      { new: true }
    );
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/subscriptions/:restaurantId - Delete subscription
router.delete('/:restaurantId', async (req, res) => {
  try {
    const subscription = await Subscription.findOneAndDelete({ restaurantId: req.params.restaurantId });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json({ message: 'Subscription deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;