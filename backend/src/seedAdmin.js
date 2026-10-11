require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const usersData = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    isActive: true
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
    isActive: true
  }
];

async function seedAdmin() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let created = 0;
    let existing = 0;

    for (const userData of usersData) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⏭️  User already exists: ${userData.email}`);
        existing++;
      } else {
        // Create user
        const user = await User.create(userData);
        console.log(`✅ Created ${user.role}: ${user.email}`);
        created++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Created: ${created} user(s)`);
    console.log(`⏭️  Skipped: ${existing} existing user(s)`);
    
    console.log('\n📧 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👑 Admin Account:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Regular User Account:');
    console.log('   Email: user@example.com');
    console.log('   Password: user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  Change passwords after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error.message);
    process.exit(1);
  }
}

seedAdmin();
