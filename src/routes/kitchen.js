const express = require('express');
const { 
  getKitchenOrders, 
  updateOrderStatus, 
  setPriority 
} = require('../controllers/kitchenController');
const auth = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

const router = express.Router();

// Get kitchen orders
router.get('/all/kitchen/orders', auth(['KITCHEN_STAFF', 'MANAGER', 'RESTAURANT_ADMIN']), tenantMiddleware, getKitchenOrders);

// Update order status
router.patch('/update/orders/status/:id', auth(['KITCHEN_STAFF', 'MANAGER', 'RESTAURANT_ADMIN']), tenantMiddleware, updateOrderStatus);

// Set order priority
router.patch('/update/orders/priority/:id', auth(['MANAGER', 'RESTAURANT_ADMIN']), tenantMiddleware, setPriority);

module.exports = router;