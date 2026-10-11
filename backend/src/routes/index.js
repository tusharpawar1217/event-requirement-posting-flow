const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const requirementRoutes = require('./requirement.routes');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount auth routes
router.use('/auth', authRoutes);

// Mount requirement routes
router.use('/', requirementRoutes);

module.exports = router;
