const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT_SECRET on startup (with fallback for dev)
const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      console.error('CRITICAL: JWT_SECRET must be at least 32 characters in production');
      throw new Error('JWT_SECRET configuration error');
    }
    // Fallback for dev only
    console.warn('WARNING: Using default JWT_SECRET for development. Set JWT_SECRET in production!');
    return 'dev-secret-key-change-in-production-min-32-chars';
  }
  return secret;
};

const JWT_SECRET = getJWTSecret();

/**
 * Authenticate user from JWT cookie
 * Requires valid token, unbanned user, matching tokenVersion
 */
async function authenticate(req, res, next) {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    // Verify JWT
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Load user
    const user = await User.findById(decoded.sub).select('+passwordHash');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Account has been banned'
        }
      });
    }

    // Check token version (for logout-all / password change)
    if (decoded.tv !== user.tokenVersion) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    // Attach user to request (without passwordHash)
    req.user = user.toJSON();
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }
    next(error);
  }
}

/**
 * Optional authentication - loads user if token present, but doesn't require it
 */
async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.sub);
    
    if (user && !user.isBanned && decoded.tv === user.tokenVersion) {
      req.user = user.toJSON();
    }
    
    next();
  } catch (error) {
    // Ignore invalid tokens for optional auth
    next();
  }
}

/**
 * Require specific role(s)
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required'
        }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Insufficient permissions'
        }
      });
    }

    next();
  };
}

/**
 * Require owner or admin for a resource
 * Expects req.params.id and a Model to load
 */
function requireOwnerOrAdmin(Model, ownerField = 'owner') {
  return async (req, res, next) => {
    try {
      const resource = await Model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Resource not found'
          }
        });
      }

      const ownerId = resource[ownerField]?.toString();
      const userId = req.user._id.toString();
      
      if (req.user.role === 'admin' || ownerId === userId) {
        req.resource = resource;
        return next();
      }

      // Return 404 (not 403) to avoid leaking existence
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found'
        }
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
  requireOwnerOrAdmin,
  JWT_SECRET
};
