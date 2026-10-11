const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generic error to prevent user enumeration
const AUTH_ERROR = 'Invalid email or password';

/**
 * Register new user
 */
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email already registered'
        }
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role
    });

    // Generate JWT
    const token = jwt.sign(
      {
        sub: user._id,
        role: user.role,
        tv: user.tokenVersion
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Login user
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+passwordHash');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: AUTH_ERROR
        }
      });
    }

    // Check if banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Account has been banned'
        }
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: AUTH_ERROR
        }
      });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      {
        sub: user._id,
        role: user.role,
        tv: user.tokenVersion
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Logout user
 */
function logout(req, res) {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
}

/**
 * Get current user
 */
function getMe(req, res) {
  res.json({
    success: true,
    data: req.user
  });
}

/**
 * Change password
 */
async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    // Load user with password
    const user = await User.findById(req.user._id).select('+passwordHash');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Current password is incorrect'
        }
      });
    }

    // Hash new password
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    
    // Increment token version to invalidate all existing tokens
    user.tokenVersion += 1;
    
    await user.save();

    // Generate new token
    const token = jwt.sign(
      {
        sub: user._id,
        role: user.role,
        tv: user.tokenVersion
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set new cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
      data: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  logout,
  getMe,
  changePassword
};
