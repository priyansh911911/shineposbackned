const express = require('express');
const { getAdvancedAnalytics, exportReport, getSalesData, setExpectedRevenue, getExpectedRevenue, getRevenueComparison } = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');

const router = express.Router();

// Get advanced analytics
router.get('/all/advanced/analytics', auth(['SUPER_ADMIN']), getAdvancedAnalytics);

// Export reports
router.post('/add/reports/export', auth(['SUPER_ADMIN']), exportReport);

// Sales data for predictions
router.get('/sales-data', auth(['RESTAURANT_ADMIN', 'STAFF']), tenantMiddleware, getSalesData);

// Expected Revenue
router.post('/expected-revenue', auth(['RESTAURANT_ADMIN']), tenantMiddleware, setExpectedRevenue);
router.get('/expected-revenue', auth(['RESTAURANT_ADMIN', 'MANAGER']), tenantMiddleware, getExpectedRevenue);
router.get('/revenue-comparison', auth(['RESTAURANT_ADMIN', 'MANAGER']), tenantMiddleware, getRevenueComparison);

module.exports = router;