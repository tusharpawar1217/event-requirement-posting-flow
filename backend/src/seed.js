require('dotenv').config();
const mongoose = require('mongoose');
const Requirement = require('./models/Requirement');

const sampleData = [
  // Planner Requirements
  {
    eventName: 'Corporate Annual Gala',
    eventType: 'Corporate',
    dateMode: 'single',
    eventDate: new Date('2027-06-15T19:00:00Z'),
    location: 'New York, NY',
    venue: 'Grand Ballroom Hotel',
    category: 'planner',
    details: {
      servicesNeeded: ['Catering', 'Decoration', 'AV Equipment'],
      guestCount: 250,
      budgetMin: 25000,
      budgetMax: 40000,
      currency: 'USD',
      theme: 'Elegant Black Tie',
      notes: 'Need premium catering and stage setup',
      needsVendorCoordination: true,
      preferredContactTime: 'Weekday mornings'
    }
  },
  {
    eventName: 'Beach Wedding Ceremony',
    eventType: 'Wedding',
    dateMode: 'single',
    eventDate: new Date('2027-08-20T16:00:00Z'),
    location: 'Malibu, CA',
    venue: 'Sunset Beach Resort',
    category: 'planner',
    details: {
      servicesNeeded: ['Catering', 'Photography', 'Decoration', 'Transportation'],
      guestCount: 150,
      budgetMin: 35000,
      budgetMax: 50000,
      currency: 'USD',
      theme: 'Romantic Beach Sunset',
      notes: 'Outdoor setup with weather backup plan needed',
      needsVendorCoordination: true,
      preferredContactTime: 'Evenings'
    }
  },
  {
    eventName: 'Tech Conference 2027',
    eventType: 'Conference',
    dateMode: 'range',
    startDate: new Date('2027-09-10T08:00:00Z'),
    endDate: new Date('2027-09-12T18:00:00Z'),
    location: 'San Francisco, CA',
    venue: 'Moscone Center',
    category: 'planner',
    details: {
      servicesNeeded: ['Venue Booking', 'AV Equipment', 'Catering', 'Transportation'],
      guestCount: 500,
      budgetMin: 75000,
      budgetMax: 100000,
      currency: 'USD',
      theme: 'Innovation & Technology',
      notes: 'Multi-day event with breakout sessions',
      needsVendorCoordination: true,
      preferredContactTime: 'Business hours'
    }
  },
  {
    eventName: 'Birthday Bash Extravaganza',
    eventType: 'Birthday',
    dateMode: 'single',
    eventDate: new Date('2027-07-05T14:00:00Z'),
    location: 'Los Angeles, CA',
    venue: 'Private Estate',
    category: 'planner',
    details: {
      servicesNeeded: ['Catering', 'Entertainment', 'Decoration'],
      guestCount: 100,
      budgetMin: 15000,
      budgetMax: 25000,
      currency: 'USD',
      theme: 'Hollywood Glamour',
      notes: 'Pool party with DJ and catering',
      needsVendorCoordination: false,
      preferredContactTime: 'Anytime'
    }
  },

  // Performer Requirements
  {
    eventName: 'Jazz Night at Blue Moon',
    eventType: 'Concert',
    dateMode: 'single',
    eventDate: new Date('2027-05-25T20:00:00Z'),
    location: 'Chicago, IL',
    venue: 'Blue Moon Jazz Club',
    category: 'performer',
    details: {
      performerType: 'Jazz Band',
      genres: ['Jazz', 'Blues'],
      durationMinutes: 180,
      numberOfPerformers: 5,
      feePerPerformer: 400,
      equipmentProvidedByHost: true,
      equipmentNotes: 'Full sound system and lighting available',
      stageSize: '20x15 feet',
      specialRequests: 'Need green room for band'
    }
  },
  {
    eventName: 'Wedding Reception Entertainment',
    eventType: 'Wedding',
    dateMode: 'single',
    eventDate: new Date('2027-06-30T19:00:00Z'),
    location: 'Austin, TX',
    venue: 'Riverside Garden',
    category: 'performer',
    details: {
      performerType: 'Cover Band',
      genres: ['Pop', 'Rock', 'R&B'],
      durationMinutes: 240,
      numberOfPerformers: 6,
      feePerPerformer: 600,
      equipmentProvidedByHost: false,
      equipmentNotes: 'Band brings own equipment',
      stageSize: '25x20 feet',
      specialRequests: 'Mix of upbeat and slow songs for dancing'
    }
  },
  {
    eventName: 'Corporate Holiday Party',
    eventType: 'Corporate',
    dateMode: 'single',
    eventDate: new Date('2027-12-15T18:00:00Z'),
    location: 'Seattle, WA',
    venue: 'Downtown Convention Center',
    category: 'performer',
    details: {
      performerType: 'DJ',
      genres: ['Electronic', 'Pop', 'Hip Hop'],
      durationMinutes: 300,
      numberOfPerformers: 1,
      feePerPerformer: 1500,
      equipmentProvidedByHost: true,
      equipmentNotes: 'DJ booth and sound system provided',
      stageSize: '15x10 feet',
      specialRequests: 'Family-friendly playlist'
    }
  },
  {
    eventName: 'Music Festival Summer Stage',
    eventType: 'Festival',
    dateMode: 'range',
    startDate: new Date('2027-07-15T12:00:00Z'),
    endDate: new Date('2027-07-17T23:00:00Z'),
    location: 'Denver, CO',
    venue: 'Red Rocks Amphitheatre',
    category: 'performer',
    details: {
      performerType: 'Rock Band',
      genres: ['Rock', 'Alternative', 'Indie'],
      durationMinutes: 120,
      numberOfPerformers: 4,
      feePerPerformer: 2000,
      equipmentProvidedByHost: true,
      equipmentNotes: 'Full festival production',
      stageSize: '40x30 feet',
      specialRequests: 'Afternoon time slot preferred'
    }
  },

  // Crew Requirements
  {
    eventName: 'Concert Tour Setup Crew',
    eventType: 'Concert',
    dateMode: 'range',
    startDate: new Date('2027-08-01T06:00:00Z'),
    endDate: new Date('2027-08-05T22:00:00Z'),
    location: 'Multiple Cities, TX',
    venue: 'Various Arenas',
    category: 'crew',
    details: {
      crewRoles: ['Stage Hands', 'Technical Crew', 'Security'],
      crewCount: 25,
      shiftStart: '06:00',
      shiftEnd: '22:00',
      experienceLevel: 'Expert',
      payRate: 35,
      payType: 'hourly',
      accommodationProvided: true,
      transportProvided: true,
      toolsRequired: ['Radios', 'Safety Gear', 'Tools'],
      notes: 'Multi-city tour, travel required'
    }
  },
  {
    eventName: 'Festival Ground Crew',
    eventType: 'Festival',
    dateMode: 'range',
    startDate: new Date('2027-06-20T08:00:00Z'),
    endDate: new Date('2027-06-25T20:00:00Z'),
    location: 'Nashville, TN',
    venue: 'Music City Festival Grounds',
    category: 'crew',
    details: {
      crewRoles: ['Stage Hands', 'Security', 'Ushers', 'Cleanup Crew'],
      crewCount: 50,
      shiftStart: '08:00',
      shiftEnd: '20:00',
      experienceLevel: 'Intermediate',
      payRate: 22,
      payType: 'hourly',
      accommodationProvided: false,
      transportProvided: false,
      toolsRequired: ['Radios', 'Safety Gear', 'Uniforms'],
      notes: 'Large outdoor festival, expect weather challenges'
    }
  },
  {
    eventName: 'Wedding Event Staff',
    eventType: 'Wedding',
    dateMode: 'single',
    eventDate: new Date('2027-09-10T14:00:00Z'),
    location: 'Miami, FL',
    venue: 'Oceanfront Resort',
    category: 'crew',
    details: {
      crewRoles: ['Ushers', 'Catering Staff', 'Parking Attendants'],
      crewCount: 15,
      shiftStart: '14:00',
      shiftEnd: '23:00',
      experienceLevel: 'Entry',
      payRate: 18,
      payType: 'hourly',
      accommodationProvided: false,
      transportProvided: false,
      toolsRequired: ['Uniforms'],
      notes: 'Formal event, professional attire required'
    }
  },
  {
    eventName: 'Corporate Event Production Team',
    eventType: 'Corporate',
    dateMode: 'single',
    eventDate: new Date('2027-10-05T07:00:00Z'),
    location: 'Boston, MA',
    venue: 'Convention Center',
    category: 'crew',
    details: {
      crewRoles: ['Technical Crew', 'Stage Hands', 'Security'],
      crewCount: 20,
      shiftStart: '07:00',
      shiftEnd: '19:00',
      experienceLevel: 'Intermediate',
      payRate: 28,
      payType: 'hourly',
      accommodationProvided: false,
      transportProvided: true,
      toolsRequired: ['Radios', 'Tools', 'Safety Gear'],
      notes: 'AV setup and teardown experience required'
    }
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Requirement.deleteMany({});
    console.log('Cleared existing requirements');

    // Insert sample data
    const inserted = await Requirement.insertMany(sampleData);
    console.log(`✅ Successfully seeded ${inserted.length} requirements!`);
    console.log('\nBreakdown:');
    console.log(`- Planners: ${inserted.filter(r => r.category === 'planner').length}`);
    console.log(`- Performers: ${inserted.filter(r => r.category === 'performer').length}`);
    console.log(`- Crew: ${inserted.filter(r => r.category === 'crew').length}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
