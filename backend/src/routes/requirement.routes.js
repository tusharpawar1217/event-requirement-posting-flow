const express = require('express');
const router = express.Router();
const requirementController = require('../controllers/requirement.controller');
const validate = require('../middleware/validate');
const { requirementSchema } = require('../schemas/requirement.schema');

router.post('/requirements', validate(requirementSchema), requirementController.create);
router.get('/requirements', requirementController.list);
router.get('/requirements/:id', requirementController.getById);

module.exports = router;
