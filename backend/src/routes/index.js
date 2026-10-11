const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const requirementRoutes = require('./requirement.routes');
const setupRoutes = require('./setup.routes');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount setup routes (for initial admin seeding)
router.use('/setup', setupRoutes);

// Mount auth routes
router.use('/auth', authRoutes);

// Mount requirement routes
router.use('/', requirementRoutes);

module.exports = router;
