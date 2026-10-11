const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust proxy - required for Render, Heroku, Vercel, etc.
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Cookie parser (must be before routes)
app.use(cookieParser());

// MongoDB query sanitization (prevents NoSQL injection)
app.use(mongoSanitize());

// CORS with credentials
const allowedOrigins = [
  'http://localhost:3000',
  'https://event-requirement-posting-flow.vercel.app',
  'https://event-requirement-posting-flow-difftbuy5.vercel.app' // Your specific deployment
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.CORS_ORIGIN === origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser (limit to 100kb, uploads handled separately by multer)
app.use(express.json({ limit: '100kb' }));

// Logging
app.use(morgan('dev'));

// Rate limiting (generic)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
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
