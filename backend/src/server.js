require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// For Vercel serverless deployment
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For local and traditional hosting (Render, Heroku, etc.)
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
