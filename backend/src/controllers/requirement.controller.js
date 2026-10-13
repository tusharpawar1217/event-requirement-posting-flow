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

    // Increment view count (unique feature)
    requirement.viewCount = (requirement.viewCount || 0) + 1;
    await requirement.save();
    
    res.json({
      success: true,
      data: requirement
    });
  } catch (error) {
    next(error);
  }
}

// NEW UNIQUE FEATURES
async function expressInterest(req, res, next) {
  try {
    const { id } = req.params;
    const { message, contact } = req.body;
    const userId = req.user?._id;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid ID format' }
      });
    }

    const requirement = await Requirement.findById(id);
    if (!requirement) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Requirement not found' }
      });
    }

    // Check if user already expressed interest
    const alreadyInterested = requirement.interestedUsers?.some(
      u => u.userId?.toString() === userId?.toString()
    );

    if (alreadyInterested) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_INTERESTED', message: 'Already expressed interest' }
      });
    }

    // Add interest
    requirement.interestedUsers = requirement.interestedUsers || [];
    requirement.interestedUsers.push({
      userId,
      message: message || '',
      contact: contact || req.user?.email,
      interestedAt: new Date()
    });
    requirement.interestCount = (requirement.interestCount || 0) + 1;
    await requirement.save();

    res.json({
      success: true,
      data: requirement,
      message: 'Interest registered successfully'
    });
  } catch (error) {
    next(error);
  }
}

async function getSimilar(req, res, next) {
  try {
    const { id } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid ID format' }
      });
    }

    const requirement = await Requirement.findById(id);
    if (!requirement) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Requirement not found' }
      });
    }

    // Find similar requirements based on category and location
    const similar = await Requirement.find({
      _id: { $ne: id },
      category: requirement.category,
      $or: [
        { location: requirement.location },
        { eventType: requirement.eventType }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(4);

    res.json({
      success: true,
      data: similar
    });
  } catch (error) {
    next(error);
  }
}

async function toggleSave(req, res, next) {
  try {
    const { id } = req.params;
    const { saved } = req.body; // true to save, false to unsave

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_ID', message: 'Invalid ID format' }
      });
    }

    const requirement = await Requirement.findById(id);
    if (!requirement) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Requirement not found' }
      });
    }

    // Update save count
    if (saved) {
      requirement.saveCount = (requirement.saveCount || 0) + 1;
    } else {
      requirement.saveCount = Math.max((requirement.saveCount || 0) - 1, 0);
    }
    await requirement.save();

    res.json({
      success: true,
      data: { saveCount: requirement.saveCount }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create,
  list,
  getById,
  expressInterest,
  getSimilar,
  toggleSave
};
