/**
 * Setup Routes - For initial admin seeding
 * These routes should be disabled after initial setup
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

/**
 * POST /api/v1/setup/seed-admin
 * Create initial admin user (only works if no admin exists)
 */
router.post('/seed-admin', async (req, res) => {
  try {
    // Check if any admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'ADMIN_EXISTS',
          message: 'Admin user already exists. This endpoint is disabled.'
        }
      });
    }

    // Check if the specific admin email exists (might have wrong role)
    const existingUser = await User.findOne({ email: 'admin@example.com' }).select('+passwordHash');
    
    if (existingUser) {
      // Update existing user to admin with proper password
      if (!existingUser.passwordHash) {
        existingUser.passwordHash = await bcrypt.hash('Admin123!SecurePassword', 12);
      }
      existingUser.role = 'admin';
      existingUser.name = 'Admin';
      await existingUser.save();
      
      return res.json({
        success: true,
        message: 'Existing user upgraded to admin',
        data: {
          email: existingUser.email,
          role: existingUser.role,
          id: existingUser._id
        }
      });
    }

    // Create new admin
    const passwordHash = await bcrypt.hash('Admin123!SecurePassword', 12);
    
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash,
      role: 'admin',
      emailNotifications: true
    });

    res.json({
      success: true,
      message: 'Admin user created successfully',
      data: {
        email: admin.email,
        role: admin.role,
        id: admin._id,
        credentials: {
          email: 'admin@example.com',
          password: 'Admin123!SecurePassword'
        }
      }
    });
  } catch (error) {
    console.error('Seed admin error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to seed admin user'
      }
    });
  }
});

/**
 * GET /api/v1/setup/status
 * Check if admin exists
 */
router.get('/status', async (req, res) => {
  try {
    const adminExists = await User.exists({ role: 'admin' });
    const adminUser = await User.findOne({ email: 'admin@example.com' }).select('+passwordHash');
    
    res.json({
      success: true,
      data: {
        adminExists: !!adminExists,
        adminEmailExists: !!adminUser,
        adminHasPassword: adminUser ? !!adminUser.passwordHash : false,
        setupRequired: !adminExists
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: error.message }
    });
  }
});

module.exports = router;
