const express = require('express');
const router = express.Router();
const { getAllSubscriptions, extendSubscription, convertToSubscription, getRestaurantSubscription } = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

router.get('/', auth(['SUPER_ADMIN']), getAllSubscriptions);
router.get('/:restaurantId', getRestaurantSubscription);
router.put('/:restaurantId/extend', auth(['SUPER_ADMIN']), extendSubscription);
router.put('/:restaurantId/convert', auth(['SUPER_ADMIN']), convertToSubscription);

module.exports = router;