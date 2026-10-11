/**
 * Seed Admin User in Production MongoDB
 * 
 * Usage: 
 * 1. Update MONGODB_URI below with your production MongoDB connection string
 * 2. Run: node backend/scripts/seed-admin-production.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// PRODUCTION MONGODB URI - UPDATE THIS
const PRODUCTION_MONGODB_URI = 'YOUR_PRODUCTION_MONGODB_URI_HERE';

// Admin credentials
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'Admin123!SecurePassword';

// User Schema (inline to avoid dependencies)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 255
  },
  passwordHash: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['client', 'planner', 'performer', 'crew', 'admin'],
    default: 'client'
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  tokenVersion: {
    type: Number,
    default: 0
  },
  lastLoginAt: Date
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  try {
    // Validate MongoDB URI
    if (!PRODUCTION_MONGODB_URI || PRODUCTION_MONGODB_URI === 'YOUR_PRODUCTION_MONGODB_URI_HERE') {
      console.error('❌ ERROR: Please update PRODUCTION_MONGODB_URI in this script');
      console.log('\nHow to get your MongoDB URI:');
      console.log('1. Go to your Vercel backend project settings');
      console.log('2. Environment Variables tab');
      console.log('3. Copy the MONGODB_URI value');
      console.log('4. Paste it in this script at line 12');
      process.exit(1);
    }

    console.log('🔌 Connecting to production MongoDB...');
    await mongoose.connect(PRODUCTION_MONGODB_URI);
    console.log('✅ Connected successfully\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log(`⚠️  Admin user already exists: ${ADMIN_EMAIL}`);
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      console.log('Created:', existingAdmin.createdAt);
      
      // Check if password is missing
      const adminWithPassword = await User.findOne({ email: ADMIN_EMAIL }).select('+passwordHash');
      if (!adminWithPassword.passwordHash) {
        console.log('\n❌ ERROR: Admin exists but passwordHash is MISSING!');
        console.log('Fixing by updating password...');
        
        const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
        adminWithPassword.passwordHash = passwordHash;
        await adminWithPassword.save();
        
        console.log('✅ Admin password has been set!');
        console.log('\nCredentials:');
        console.log('Email:', ADMIN_EMAIL);
        console.log('Password:', ADMIN_PASSWORD);
      } else {
        console.log('\n✅ Password exists. Try logging in with:');
        console.log('Email:', ADMIN_EMAIL);
        console.log('Password:', ADMIN_PASSWORD);
      }
      
      await mongoose.connection.close();
      process.exit(0);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Admin',
      email: ADMIN_EMAIL,
      passwordHash,
      role: 'admin',
      emailNotifications: true
    });

    console.log('\n✅ Admin user created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password:', ADMIN_PASSWORD);
    console.log('👑 Role:', admin.role);
    console.log('🆔 ID:', admin._id);
    console.log('📅 Created:', admin.createdAt);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✨ You can now login at your frontend with these credentials!');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding admin:', error.message);
    if (error.code === 11000) {
      console.log('\n💡 Tip: Admin already exists. Use different email or delete existing admin first.');
    }
    process.exit(1);
  }
}

console.log('🚀 Admin Seeding Script for Production\n');
seedAdmin();
