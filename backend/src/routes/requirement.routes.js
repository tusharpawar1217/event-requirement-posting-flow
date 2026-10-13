const express = require('express');
const router = express.Router();
const requirementController = require('../controllers/requirement.controller');
const validate = require('../middleware/validate');
const { requirementSchema } = require('../schemas/requirement.schema');
const { protect } = require('../middleware/auth');

router.post('/requirements', validate(requirementSchema), requirementController.create);
router.get('/requirements', requirementController.list);
router.get('/requirements/:id', requirementController.getById);

// NEW UNIQUE FEATURES
router.post('/requirements/:id/interest', protect, requirementController.expressInterest);
router.get('/requirements/:id/similar', requirementController.getSimilar);
router.post('/requirements/:id/save', requirementController.toggleSave);

module.exports = router;
