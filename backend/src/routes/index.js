const express = require('express');
const router = express.Router();
const requirementRoutes = require('./requirement.routes');
const authRoutes = require('./auth.routes');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/', requirementRoutes);

module.exports = router;
