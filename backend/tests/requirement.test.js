const request = require('supertest');
const { requirementSchema } = require('../src/schemas/requirement.schema');

// Mock the Requirement model
jest.mock('../src/models/Requirement');
const Requirement = require('../src/models/Requirement');

const app = require('../src/app');

describe('Requirement API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/health', () => {
    it('should return ok status', async () => {
      const response = await request(app).get('/api/v1/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('Zod Schema Validation', () => {
    it('should validate a valid planner payload', () => {
      const validPlanner = {
        eventName: 'Corporate Annual Meeting',
        eventType: 'Corporate',
        dateMode: 'single',
        eventDate: '2027-05-15T10:00:00.000Z',
        location: 'New York',
        venue: 'Convention Center',
        category: 'planner',
        details: {
          servicesNeeded: ['Catering', 'AV Equipment'],
          guestCount: 200,
          budgetMin: 10000,
          budgetMax: 20000,
          currency: 'USD',
          theme: 'Professional',
          needsVendorCoordination: true
        }
      };

      const result = requirementSchema.safeParse(validPlanner);
      expect(result.success).toBe(true);
    });

    it('should validate a valid performer payload', () => {
      const validPerformer = {
        eventName: 'Wedding Reception',
        eventType: 'Wedding',
        dateMode: 'single',
        eventDate: '2027-06-20T18:00:00.000Z',
        location: 'Los Angeles',
        venue: 'Grand Hotel',
        category: 'performer',
        details: {
          performerType: 'Band',
          genres: ['Jazz', 'Pop'],
          durationMinutes: 180,
          numberOfPerformers: 5,
          feePerPerformer: 500,
          equipmentProvidedByHost: true,
          stageSize: '20x15 feet'
        }
      };

      const result = requirementSchema.safeParse(validPerformer);
      expect(result.success).toBe(true);
    });

    it('should validate a valid crew payload', () => {
      const validCrew = {
        eventName: 'Music Festival',
        eventType: 'Festival',
        dateMode: 'range',
        startDate: '2027-07-10T08:00:00.000Z',
        endDate: '2027-07-12T23:00:00.000Z',
        location: 'Austin',
        venue: 'Zilker Park',
        category: 'crew',
        details: {
          crewRoles: ['Stage Hands', 'Security'],
          crewCount: 20,
          shiftStart: '08:00',
          shiftEnd: '20:00',
          experienceLevel: 'Intermediate',
          payRate: 25,
          payType: 'hourly',
          accommodationProvided: true,
          transportProvided: false,
          toolsRequired: ['Radios', 'Safety Gear']
        }
      };

      const result = requirementSchema.safeParse(validCrew);
      expect(result.success).toBe(true);
    });

    it('should fail when endDate is before startDate', () => {
      const invalidPayload = {
        eventName: 'Test Event',
        eventType: 'Conference',
        dateMode: 'range',
        startDate: '2027-05-20T10:00:00.000Z',
        endDate: '2027-05-15T10:00:00.000Z',
        location: 'Seattle',
        category: 'planner',
        details: {
          servicesNeeded: ['Venue'],
          guestCount: 100,
          budgetMin: 5000,
          budgetMax: 10000,
          currency: 'USD'
        }
      };

      const result = requirementSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.errors.some(e => e.path.includes('endDate'))).toBe(true);
    });

    it('should fail when budgetMax is less than budgetMin', () => {
      const invalidPayload = {
        eventName: 'Birthday Party',
        eventType: 'Birthday',
        dateMode: 'single',
        eventDate: '2027-08-15T14:00:00.000Z',
        location: 'Miami',
        category: 'planner',
        details: {
          servicesNeeded: ['Catering'],
          guestCount: 50,
          budgetMin: 10000,
          budgetMax: 5000,
          currency: 'USD'
        }
      };

      const result = requirementSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.errors.some(e => 
        e.path.includes('budgetMax') || e.message.includes('budget')
      )).toBe(true);
    });

    it('should fail when shift end is before shift start', () => {
      const invalidPayload = {
        eventName: 'Concert Setup',
        eventType: 'Concert',
        dateMode: 'single',
        eventDate: '2027-09-10T12:00:00.000Z',
        location: 'Chicago',
        category: 'crew',
        details: {
          crewRoles: ['Setup'],
          crewCount: 10,
          shiftStart: '18:00',
          shiftEnd: '08:00',
          experienceLevel: 'Entry',
          payRate: 20,
          payType: 'hourly',
          accommodationProvided: false,
          transportProvided: false
        }
      };

      const result = requirementSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.errors.some(e => 
        e.path.includes('shiftEnd') || e.message.includes('shift')
      )).toBe(true);
    });

    it('should reject wrong-category fields with strict mode', () => {
      const invalidPayload = {
        eventName: 'Test Event',
        eventType: 'Wedding',
        dateMode: 'single',
        eventDate: '2027-10-10T15:00:00.000Z',
        location: 'Boston',
        category: 'planner',
        wrongField: 'should not be here',
        details: {
          servicesNeeded: ['Venue'],
          guestCount: 150,
          budgetMin: 8000,
          budgetMax: 15000,
          currency: 'USD'
        }
      };

      const result = requirementSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    it('should require eventTypeOther when eventType is Other', () => {
      const invalidPayload = {
        eventName: 'Special Event',
        eventType: 'Other',
        dateMode: 'single',
        eventDate: '2027-11-05T12:00:00.000Z',
        location: 'Denver',
        category: 'planner',
        details: {
          servicesNeeded: ['Custom Service'],
          guestCount: 75,
          budgetMin: 5000,
          budgetMax: 8000,
          currency: 'USD'
        }
      };

      const result = requirementSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.errors.some(e => e.path.includes('eventTypeOther'))).toBe(true);
    });
  });

  describe('POST /api/v1/requirements - Controller Logic', () => {
    it('should create a requirement with mocked model', async () => {
      const saveMock = jest.fn().mockResolvedValue(true);
      
      const mockRequirement = {
        _id: '507f1f77bcf86cd799439011',
        eventName: 'Test Event',
        category: 'planner',
        save: saveMock
      };

      Requirement.mockImplementation(() => mockRequirement);

      const validPayload = {
        eventName: 'Test Event',
        eventType: 'Corporate',
        dateMode: 'single',
        eventDate: '2027-12-01T10:00:00.000Z',
        location: 'San Francisco',
        category: 'planner',
        details: {
          servicesNeeded: ['Venue'],
          guestCount: 100,
          budgetMin: 5000,
          budgetMax: 10000,
          currency: 'USD'
        }
      };

      const response = await request(app)
        .post('/api/v1/requirements')
        .send(validPayload);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should return 422 for invalid payload', async () => {
      const invalidPayload = {
        eventName: '',
        category: 'planner'
      };

      const response = await request(app)
        .post('/api/v1/requirements')
        .send(invalidPayload);

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
