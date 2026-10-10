const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust proxy - required for Render, Heroku, etc.
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));

// Body parser
app.use(express.json({ limit: '100kb' }));

// Logging
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Event Requirement Posting API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      requirements: '/api/v1/requirements',
      documentation: 'https://github.com/tusharpawar1217/event-requirement-posting-flow'
    }
  });
});

// API routes
app.use('/api/v1', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// Error handler
app.use(errorHandler);

module.exports = app;
