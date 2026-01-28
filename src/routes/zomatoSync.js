const express = require('express');
const auth = require('../middleware/auth');
const checkSubscription = require('../middleware/checkSubscription');
const tenantMiddleware = require('../middleware/tenant');
const { syncZomatoMenu } = require('../controllers/zomatoSyncController');

const router = express.Router();

router.post('/sync-menu', 
  auth(['RESTAURANT_ADMIN']), 
  checkSubscription, 
  tenantMiddleware, 
  syncZomatoMenu
);

module.exports = router;
