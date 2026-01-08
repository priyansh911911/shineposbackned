const express = require('express');
const router = express.Router();
const { getAllSubscriptions, extendSubscription, convertToSubscription, getRestaurantSubscription } = require('../controllers/subscriptionController');
const auth = require('../middleware/auth');

router.get('/', auth(['SUPER_ADMIN']), getAllSubscriptions);
router.get('/all/restaurants/:restaurantId', getRestaurantSubscription);
router.patch('update/restaurants/:restaurantId/extend', auth(['SUPER_ADMIN']), extendSubscription);
router.post('add/restaurants/:restaurantId/convert', auth(['SUPER_ADMIN']), convertToSubscription);

module.exports = router;