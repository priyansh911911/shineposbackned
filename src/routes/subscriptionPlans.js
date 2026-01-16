const express = require('express');
const { getSubscriptionPlans, subscribeToPlan, getSubscriptionStatus } = require('../controllers/subscriptionPlanController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all subscription plans (public or authenticated)
router.get('/plans', getSubscriptionPlans);

// Subscribe to a plan (restaurant admin only)
router.post('/subscribe', auth(['RESTAURANT_ADMIN']), subscribeToPlan);

// Get subscription status
router.get('/status/:restaurantId', auth(['RESTAURANT_ADMIN', 'SUPER_ADMIN']), getSubscriptionStatus);

module.exports = router;
