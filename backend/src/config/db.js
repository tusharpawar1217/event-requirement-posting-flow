const mongoose = require('mongoose');

// Cache connection for serverless (Vercel)
let cachedConnection = null;

async function connectDB() {
  // If already connected, reuse connection
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout for serverless
      socketTimeoutMS: 45000,
    });
    
    cachedConnection = conn;
    console.log('MongoDB connected successfully');
    return conn;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    
    // Don't exit process on Vercel (serverless)
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error;
  }
}

module.exports = connectDB;
