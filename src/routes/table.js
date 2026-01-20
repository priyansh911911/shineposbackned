const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const tenantMiddleware = require('../middleware/tenant');
const { activityLogger } = require('../middleware/activityLogger');
const {
    createTable,
    getTables,
    getTableById,
    updateTable,
    updateTableStatus,
    deleteTable,
    getAvailableTables
} = require('../controllers/tableController');

const router = express.Router();

router.post('/add/table', auth(['RESTAURANT_ADMIN']), tenantMiddleware, activityLogger('Table'), [
    body('tableNumber').trim().notEmpty().withMessage('Table number is required'),
    body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1')
], createTable);

router.get('/all/table', auth(['RESTAURANT_ADMIN', 'STAFF']), tenantMiddleware, activityLogger('Table'), getTables);
router.get('/available/table', auth(['RESTAURANT_ADMIN', 'STAFF']), tenantMiddleware, activityLogger('Table'), getAvailableTables);
router.get('/table/:id', auth(['RESTAURANT_ADMIN', 'STAFF']), tenantMiddleware, activityLogger('Table'), getTableById);
router.put('/update/table/:id', auth(['RESTAURANT_ADMIN']), tenantMiddleware, activityLogger('Table'), updateTable);
router.patch('/status/table/:id', auth(['RESTAURANT_ADMIN', 'STAFF']), tenantMiddleware, activityLogger('Table'), updateTableStatus);
router.delete('/delete/table/:id', auth(['RESTAURANT_ADMIN']), tenantMiddleware, activityLogger('Table'), deleteTable);

module.exports = router;