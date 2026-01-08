const express = require('express');
const { body } = require('express-validator');
const { login, registerSuperAdmin } = require('../controllers/authController');

const router = express.Router();

// Register super admin route
router.post('/add/register-super-admin',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').isLength({ min: 1 }).withMessage('Name is required')
  ],
  registerSuperAdmin
);

// Login route
router.post('/add/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 1 }).withMessage('Password is required')
  ],
  login
);

module.exports = router;