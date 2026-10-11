const mongoose = require('mongoose');

const baseSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true },
    eventType: { 
      type: String, 
      required: true,
      enum: ['Wedding', 'Corporate', 'Concert', 'Birthday', 'Festival', 'Conference', 'Other']
    },
    eventTypeOther: { type: String },
    dateMode: { 
      type: String, 
      required: true,
      enum: ['single', 'range']
    },
    eventDate: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    location: { type: String, required: true },
    venue: { type: String },
    category: { 
      type: String, 
      required: true,
      enum: ['planner', 'performer', 'crew']
    },
    status: { 
      type: String, 
      default: 'open',
      enum: ['open', 'closed', 'in-progress']
    }
  },
  { 
    timestamps: true,
    discriminatorKey: 'category'
  }
);

baseSchema.index({ category: 1, createdAt: -1 });

const Requirement = mongoose.model('Requirement', baseSchema);

// Planner discriminator
const plannerDetailsSchema = new mongoose.Schema({
  details: {
    servicesNeeded: [String],
    guestCount: Number,
    budgetMin: Number,
    budgetMax: Number,
    currency: String,
    theme: String,
    notes: String,
    needsVendorCoordination: Boolean,
    preferredContactTime: String
  }
}, { _id: false });

const Planner = Requirement.discriminator('planner', plannerDetailsSchema);

// Performer discriminator
const performerDetailsSchema = new mongoose.Schema({
  details: {
    performerType: String,
    genres: [String],
    durationMinutes: Number,
    numberOfPerformers: Number,
    feePerPerformer: Number,
    equipmentProvidedByHost: Boolean,
    equipmentNotes: String,
    stageSize: String,
    specialRequests: String
  }
}, { _id: false });

const Performer = Requirement.discriminator('performer', performerDetailsSchema);

// Crew discriminator
const crewDetailsSchema = new mongoose.Schema({
  details: {
    crewRoles: [String],
    crewCount: Number,
    shiftStart: String,
    shiftEnd: String,
    experienceLevel: String,
    payRate: Number,
    payType: String,
    accommodationProvided: Boolean,
    transportProvided: Boolean,
    toolsRequired: [String],
    notes: String
  }
}, { _id: false });

const Crew = Requirement.discriminator('crew', crewDetailsSchema);

module.exports = Requirement;
