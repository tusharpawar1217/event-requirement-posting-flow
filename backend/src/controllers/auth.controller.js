const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'USER_EXISTS',
          message: 'User with this email already exists'
        }
      });
    }

    // Create new user
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message
      }
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Server error'
      }
    });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    
    req.user.name = name || req.user.name;
    await req.user.save();

    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'UPDATE_ERROR',
        message: error.message
      }
    });
  }
};
