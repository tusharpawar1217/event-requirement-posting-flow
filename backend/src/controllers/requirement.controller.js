const mongoose = require('mongoose');
const Requirement = require('../models/Requirement');

async function create(req, res, next) {
  try {
    const data = req.validated;
    
    // Create using the base model - discriminator is handled automatically
    const requirement = new Requirement(data);
    await requirement.save();
    
    res.status(201).json({
      success: true,
      data: requirement
    });
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    
    // Parse and validate pagination
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 50); // Max 50 items per page
    const skip = (pageNum - 1) * limitNum;
    
    // Build filter
    const filter = {};
    if (category) {
      filter.category = category;
    }
    
    // Execute query
    const [requirements, total] = await Promise.all([
      Requirement.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Requirement.countDocuments(filter)
    ]);
    
    res.json({
      success: true,
      data: requirements,
      meta: {
        total,
        page: pageNum,
        limit: limitNum
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_ID',
          message: 'Invalid ID format'
        }
      });
    }
    
    const requirement = await Requirement.findById(id);
    
    if (!requirement) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Requirement not found'
        }
      });
    }
    
    res.json({
      success: true,
      data: requirement
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  list,
  getById
};
