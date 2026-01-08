const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const auth = require('../middleware/auth');

router.get('/all/status', auth(['RESTAURANT_ADMIN', 'MANAGER', 'CHEF', 'WAITER', 'CASHIER']), async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.user.restaurantSlug });
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const now = new Date();
    const isExpired = restaurant.subscriptionEndDate && new Date(restaurant.subscriptionEndDate) < now;
    const daysRemaining = restaurant.subscriptionEndDate 
      ? Math.ceil((new Date(restaurant.subscriptionEndDate) - now) / (1000 * 60 * 60 * 24))
      : null;

    res.json({
      plan: restaurant.subscriptionPlan,
      subscriptionStartDate: restaurant.subscriptionStartDate,
      subscriptionEndDate: restaurant.subscriptionEndDate,
      daysRemaining,
      isExpired
    });
  } catch (error) {
    console.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

module.exports = router;