const express = require('express');
const { body } = require('express-validator');
const { register, login, me } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register
router.post('/register',
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  register
);

// POST /api/auth/login
router.post('/login',
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  login
);

// GET /api/auth/me
router.get('/me', authenticate, me);

module.exports = router;
