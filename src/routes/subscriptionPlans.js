const express = require('express');
const { getSubscriptionPlans, subscribeToPlan, getSubscriptionStatus, cancelSubscription, renewSubscription } = require('../controllers/subscriptionPlanController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all subscription plans (public or authenticated)
router.get('/plans', getSubscriptionPlans);

// Subscribe to a plan (restaurant admin only)
router.post('/subscribe', auth(['RESTAURANT_ADMIN']), subscribeToPlan);

// Renew subscription (Super Admin only)
router.post('/renew', auth(['SUPER_ADMIN']), renewSubscription);

// Get subscription status
router.get('/status/:restaurantId', auth(['RESTAURANT_ADMIN', 'SUPER_ADMIN']), getSubscriptionStatus);

// Cancel subscription (super admin only)
router.post('/cancel/:restaurantId', auth(['SUPER_ADMIN']), cancelSubscription);

module.exports = router;
