const { z } = require('zod');

// Base schema fields
const baseSchema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  eventType: z.enum(['Wedding', 'Corporate', 'Concert', 'Birthday', 'Festival', 'Conference', 'Other']),
  eventTypeOther: z.string().optional(),
  dateMode: z.enum(['single', 'range']),
  eventDate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  venue: z.string().optional()
});

// Planner details schema
const plannerDetailsSchema = z.object({
  servicesNeeded: z.array(z.string()).min(1, 'At least one service is required'),
  guestCount: z.coerce.number().positive('Guest count must be positive'),
  budgetMin: z.coerce.number().nonnegative('Budget min must be non-negative'),
  budgetMax: z.coerce.number().positive('Budget max must be positive'),
  currency: z.string().min(1, 'Currency is required'),
  theme: z.string().optional(),
  notes: z.string().optional(),
  needsVendorCoordination: z.boolean().optional(),
  preferredContactTime: z.string().optional()
});

const plannerSchema = baseSchema.extend({
  category: z.literal('planner'),
  details: plannerDetailsSchema
}).strict();

// Performer details schema
const performerDetailsSchema = z.object({
  performerType: z.string().min(1, 'Performer type is required'),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
  durationMinutes: z.coerce.number().positive('Duration must be positive'),
  numberOfPerformers: z.coerce.number().positive('Number of performers must be positive'),
  feePerPerformer: z.coerce.number().nonnegative('Fee must be non-negative'),
  equipmentProvidedByHost: z.boolean(),
  equipmentNotes: z.string().optional(),
  stageSize: z.string().optional(),
  specialRequests: z.string().optional()
});

const performerSchema = baseSchema.extend({
  category: z.literal('performer'),
  details: performerDetailsSchema
}).strict();

// Crew details schema
const crewDetailsSchema = z.object({
  crewRoles: z.array(z.string()).min(1, 'At least one crew role is required'),
  crewCount: z.coerce.number().positive('Crew count must be positive'),
  shiftStart: z.string().min(1, 'Shift start time is required'),
  shiftEnd: z.string().min(1, 'Shift end time is required'),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  payRate: z.coerce.number().nonnegative('Pay rate must be non-negative'),
  payType: z.string().min(1, 'Pay type is required'),
  accommodationProvided: z.boolean(),
  transportProvided: z.boolean(),
  toolsRequired: z.array(z.string()).optional(),
  notes: z.string().optional()
});

const crewSchema = baseSchema.extend({
  category: z.literal('crew'),
  details: crewDetailsSchema
}).strict();

// Discriminated union
const requirementSchema = z.discriminatedUnion('category', [
  plannerSchema,
  performerSchema,
  crewSchema
]).superRefine((data, ctx) => {
  // Validate eventTypeOther is provided when eventType is "Other"
  if (data.eventType === 'Other' && !data.eventTypeOther) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Event type details required when type is "Other"',
      path: ['eventTypeOther']
    });
  }

  // Validate date fields based on dateMode
  if (data.dateMode === 'single') {
    if (!data.eventDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Event date is required for single date mode',
        path: ['eventDate']
      });
    }
    // Check date not in past
    if (data.eventDate && new Date(data.eventDate) < new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Event date cannot be in the past',
        path: ['eventDate']
      });
    }
  }

  if (data.dateMode === 'range') {
    if (!data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date is required for date range mode',
        path: ['startDate']
      });
    }
    if (!data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date is required for date range mode',
        path: ['endDate']
      });
    }
    // Check dates not in past
    if (data.startDate && new Date(data.startDate) < new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date cannot be in the past',
        path: ['startDate']
      });
    }
    // Check endDate >= startDate
    if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be after or equal to start date',
        path: ['endDate']
      });
    }
  }

  // Category-specific validations
  if (data.category === 'planner') {
    if (data.details.budgetMax < data.details.budgetMin) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Budget max must be greater than or equal to budget min',
        path: ['details', 'budgetMax']
      });
    }
  }

  if (data.category === 'crew') {
    // Parse times and validate shiftEnd > shiftStart
    const start = data.details.shiftStart;
    const end = data.details.shiftEnd;
    if (start && end && end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Shift end time must be after shift start time',
        path: ['details', 'shiftEnd']
      });
    }
  }
});

module.exports = { requirementSchema };
