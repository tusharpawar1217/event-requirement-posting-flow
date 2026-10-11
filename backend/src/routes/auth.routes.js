const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, changePasswordSchema } = require('../schemas/auth.schema');

// Rate limit for auth endpoints (10 requests per 15 minutes per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public routes with rate limiting
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// Public logout (no rate limit needed)
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.patch('/password', authenticate, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
