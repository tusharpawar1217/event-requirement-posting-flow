import { z } from 'zod';

// Step 1: Event Basics
export const step1Schema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  eventType: z.enum(['Wedding', 'Corporate', 'Concert', 'Birthday', 'Festival', 'Conference', 'Other']),
  eventTypeOther: z.string().optional(),
  dateMode: z.enum(['single', 'range']),
  eventDate: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  location: z.string().min(1, 'Location is required'),
  venue: z.string().optional(),
  category: z.enum(['planner', 'performer', 'crew'])
}).superRefine((data, ctx) => {
  if (data.eventType === 'Other' && !data.eventTypeOther) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please specify event type',
      path: ['eventTypeOther']
    });
  }
  if (data.dateMode === 'single' && !data.eventDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Event date is required',
      path: ['eventDate']
    });
  }
  if (data.dateMode === 'range') {
    if (!data.startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start date is required',
        path: ['startDate']
      });
    }
    if (!data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date is required',
        path: ['endDate']
      });
    }
    if (data.startDate && data.endDate && new Date(data.endDate) < new Date(data.startDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be after start date',
        path: ['endDate']
      });
    }
  }
});

// Step 2: Planner Details
export const step2PlannerSchema = z.object({
  servicesNeeded: z.array(z.string()).min(1, 'Select at least one service'),
  guestCount: z.coerce.number().positive('Guest count must be positive'),
  budgetMin: z.coerce.number().nonnegative('Budget min must be non-negative'),
  budgetMax: z.coerce.number().positive('Budget max must be positive'),
  currency: z.string().min(1, 'Currency is required')
}).superRefine((data, ctx) => {
  if (data.budgetMax < data.budgetMin) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Budget max must be greater than or equal to budget min',
      path: ['budgetMax']
    });
  }
});

// Step 2: Performer Details
export const step2PerformerSchema = z.object({
  performerType: z.string().min(1, 'Performer type is required'),
  genres: z.array(z.string()).min(1, 'Select at least one genre'),
  durationMinutes: z.coerce.number().positive('Duration must be positive'),
  numberOfPerformers: z.coerce.number().positive('Number of performers must be positive')
});

// Step 2: Crew Details
export const step2CrewSchema = z.object({
  crewRoles: z.array(z.string()).min(1, 'Select at least one role'),
  crewCount: z.coerce.number().positive('Crew count must be positive'),
  shiftStart: z.string().min(1, 'Shift start is required'),
  shiftEnd: z.string().min(1, 'Shift end is required')
}).superRefine((data, ctx) => {
  if (data.shiftStart && data.shiftEnd && data.shiftEnd <= data.shiftStart) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Shift end must be after shift start',
      path: ['shiftEnd']
    });
  }
});

// Step 3: Planner Additional Details
export const step3PlannerSchema = z.object({
  theme: z.string().optional(),
  notes: z.string().optional(),
  needsVendorCoordination: z.boolean().optional(),
  preferredContactTime: z.string().optional()
});

// Step 3: Performer Additional Details
export const step3PerformerSchema = z.object({
  feePerPerformer: z.coerce.number().nonnegative('Fee must be non-negative'),
  equipmentProvidedByHost: z.boolean(),
  equipmentNotes: z.string().optional(),
  stageSize: z.string().optional(),
  specialRequests: z.string().optional()
});

// Step 3: Crew Additional Details
export const step3CrewSchema = z.object({
  experienceLevel: z.string().min(1, 'Experience level is required'),
  payRate: z.coerce.number().nonnegative('Pay rate must be non-negative'),
  payType: z.string().min(1, 'Pay type is required'),
  accommodationProvided: z.boolean(),
  transportProvided: z.boolean(),
  toolsRequired: z.array(z.string()).optional(),
  notes: z.string().optional()
});
