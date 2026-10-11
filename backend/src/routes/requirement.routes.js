const express = require('express');
const router = express.Router();
const requirementController = require('../controllers/requirement.controller');
const validate = require('../middleware/validate');
const { requirementSchema } = require('../schemas/requirement.schema');
const { authenticate } = require('../middleware/auth');

// Optional auth middleware - works with or without auth
const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    return authenticate(req, res, next);
  }
  next();
};

router.post('/requirements', optionalAuth, validate(requirementSchema), requirementController.create);
router.get('/requirements', requirementController.list);
router.get('/requirements/:id', requirementController.getById);
router.put('/requirements/:id', authenticate, validate(requirementSchema), requirementController.update);
router.delete('/requirements/:id', authenticate, requirementController.deleteRequirement);

module.exports = router;
