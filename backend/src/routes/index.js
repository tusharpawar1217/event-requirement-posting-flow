const express = require('express');
const router = express.Router();
const requirementRoutes = require('./requirement.routes');

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Mount requirement routes
router.use('/', requirementRoutes);

module.exports = router;
