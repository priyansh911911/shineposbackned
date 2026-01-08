const express = require('express');
const { createMessage, getMessages, getRestaurantMessages, markAsRead } = require('../controllers/communicationController');
const auth = require('../middleware/auth');

const router = express.Router();

// Super admin routes
router.post('/add', auth(['SUPER_ADMIN']), createMessage);
router.get('/all', auth(['SUPER_ADMIN']), getMessages);

// Restaurant routes
router.get('/all/restaurants/messages/:restaurantId', auth(['RESTAURANT_ADMIN', 'STAFF']), getRestaurantMessages);
router.patch('/update/messages/read/:messageId', auth(['RESTAURANT_ADMIN', 'STAFF']), markAsRead);

module.exports = router;