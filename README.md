# Requirement Posting Flow

A full-stack monorepo application for posting event requirements across three categories: Event Planners, Performers, and Crew Members. Built with Node.js, Express, MongoDB, Next.js 14, React 18, and Tailwind CSS v3.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Database Design](#database-design)
- [Deployment](#deployment)
- [Testing](#testing)
- [Assumptions](#assumptions)
- [Edge Cases](#edge-cases)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)

## 📁 Project Structure

```
requirement-posting/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Mongoose models with discriminators
│   │   ├── routes/          # API routes
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── seed.js          # Database seeding script (12 dummy requirements)
│   │   ├── app.js           # Express app setup
│   │   └── server.js        # Server entry point
│   ├── tests/               # Jest test files
│   ├── package.json
│   └── .env
├── frontend/
│   ├── app/
│   │   ├── page.js          # Landing page with category cards
│   │   ├── post/            # Multi-step wizard for posting
│   │   └── browse/          # Browse requirements by category
│   ├── components/
│   │   ├── steps/           # Wizard steps (Step1-4)
│   │   └── wizard/          # Reusable wizard components
│   ├── lib/                 # API client, schemas
│   ├── store/               # Zustand state management
│   ├── package.json
│   └── .env.local
└── README.md
```

## 🎨 Features

### Landing Page
- Three clickable category cards: Event Planners, Performers, Crew Members
- Cosmic-themed dark UI with Midnight Milky Way color palette
- Interactive hover effects with smooth transitions
- "Post a Requirement" button to start wizard

### Browse Page
- Filter requirements by category (Planner/Performer/Crew)
- Tabbed interface to switch between categories
- Grid layout displaying requirement cards with:
  - Event name, date, location, budget
  - Category-specific details (event type, performance type, crew role)
  - Posted date
  - Responsive design for mobile and desktop

### Posting Wizard
- 4-step multi-step form with progress indicator
- Step 1: Event basics (name, type, date, location, category)
- Step 2: Category-specific details part 1
- Step 3: Category-specific details part 2
- Step 4: Review and submit with edit capability
- Form validation with Zod
- LocalStorage persistence for draft saving
- Success screen with requirement ID and category

### Color Scheme (Midnight Milky Way)
- **Starlit** (#D4AA98): Primary accent, headers, highlights
- **Moonstone** (#77708D): Secondary accent, interactive elements
- **Nebula** (#4E5D68): Borders, subtle backgrounds
- **Midnight** (#2B313A): Card backgrounds, containers
- **Cosmic** (#0F1115): Page background with radial gradient starlight effect

## 🛠 Technology Stack

### Backend
- **Node.js**: 20.x (LTS)
- **Express**: 4.21.1 - Web framework
- **MongoDB**: 8.7.3 (Mongoose) - Database with discriminators
- **Zod**: 3.23.8 - Schema validation
- **Jest**: 29.7.0 - Testing framework
- **Helmet**: 8.0.0 - Security headers
- **CORS**: 2.8.5 - Cross-origin resource sharing
- **Morgan**: 1.10.0 - HTTP request logger
- **Express Rate Limit**: 7.4.1 - Rate limiting

### Frontend
- **Next.js**: 14.2.15 - React framework
- **React**: 18.3.1 - UI library
- **Tailwind CSS**: 3.4.14 - Styling
- **React Hook Form**: 7.53.0 - Form management
- **Zustand**: 4.5.5 - State management
- **Axios**: 1.7.7 - HTTP client
- **Zod**: 3.23.8 - Client-side validation

## 🚀 Setup Instructions

### Prerequisites
- Node.js 20.x LTS
- npm 10.x
- MongoDB (local or Atlas)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies (exact versions):**
   ```bash
   npm install --save-exact
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/requirement_posting
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB:**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Seed the database with dummy data (optional):**
   ```bash
   node src/seed.js
   ```
   
   This creates 12 sample requirements:
   - 4 Event Planner requirements
   - 4 Performer requirements
   - 4 Crew requirements

6. **Run tests:**
   ```bash
   npm test
   ```

7. **Start development server:**
   ```bash
   npm start
   ```

   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies (exact versions):**
   ```bash
   npm install --save-exact
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```

4. **Build the application:**
   ```bash
   npm run build
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

### Quick Start (Both Servers)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Then visit: **http://localhost:3000**

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Endpoints

#### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok"
}
```

---

#### 2. Create Requirement
```http
POST /requirements
Content-Type: application/json
```

**Request Body (Planner Example):**
```json
{
  "eventName": "Corporate Annual Meeting",
  "eventType": "Corporate",
  "dateMode": "single",
  "eventDate": "2027-05-15T10:00:00.000Z",
  "location": "New York",
  "venue": "Convention Center",
  "category": "planner",
  "details": {
    "servicesNeeded": ["Catering", "AV Equipment"],
    "guestCount": 200,
    "budgetMin": 10000,
    "budgetMax": 20000,
    "currency": "USD",
    "theme": "Professional",
    "notes": "Formal dress code required",
    "needsVendorCoordination": true,
    "preferredContactTime": "Mornings"
  }
}
```

**Request Body (Performer Example):**
```json
{
  "eventName": "Wedding Reception",
  "eventType": "Wedding",
  "dateMode": "single",
  "eventDate": "2027-06-20T18:00:00.000Z",
  "location": "Los Angeles",
  "venue": "Grand Hotel",
  "category": "performer",
  "details": {
    "performerType": "Band",
    "genres": ["Jazz", "Pop"],
    "durationMinutes": 180,
    "numberOfPerformers": 5,
    "feePerPerformer": 500,
    "equipmentProvidedByHost": true,
    "equipmentNotes": "Sound system and stage available",
    "stageSize": "20x15 feet",
    "specialRequests": "Need green room access"
  }
}
```

**Request Body (Crew Example):**
```json
{
  "eventName": "Music Festival",
  "eventType": "Festival",
  "dateMode": "range",
  "startDate": "2027-07-10T08:00:00.000Z",
  "endDate": "2027-07-12T23:00:00.000Z",
  "location": "Austin",
  "venue": "Zilker Park",
  "category": "crew",
  "details": {
    "crewRoles": ["Stage Hands", "Security"],
    "crewCount": 20,
    "shiftStart": "08:00",
    "shiftEnd": "20:00",
    "experienceLevel": "Intermediate",
    "payRate": 25,
    "payType": "hourly",
    "accommodationProvided": true,
    "transportProvided": false,
    "toolsRequired": ["Radios", "Safety Gear"],
    "notes": "Must be available for all three days"
  }
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "eventName": "Corporate Annual Meeting",
    "eventType": "Corporate",
    "dateMode": "single",
    "eventDate": "2027-05-15T10:00:00.000Z",
    "location": "New York",
    "venue": "Convention Center",
    "category": "planner",
    "status": "open",
    "details": { ... },
    "createdAt": "2026-10-10T10:00:00.000Z",
    "updatedAt": "2026-10-10T10:00:00.000Z"
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "eventName",
        "message": "Event name is required"
      }
    ]
  }
}
```

---

#### 3. List Requirements
```http
GET /requirements?category=planner&page=1&limit=10
```

**Query Parameters:**
- `category` (optional): Filter by category (planner, performer, crew)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 50)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    { ... requirement object ... }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

---

#### 4. Get Requirement by ID
```http
GET /requirements/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "data": { ... requirement object ... }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Requirement not found"
  }
}
```

## 🗄 Database Design

### MongoDB Schema with Discriminators

The application uses **Mongoose discriminators** to handle three requirement types in a single collection while maintaining type-specific fields.

#### Why Discriminators?

1. **Single Collection**: All requirements stored in one `requirements` collection
2. **Shared Fields**: Common fields (event name, dates, location) in base schema
3. **Type-Specific Fields**: Category-specific fields in discriminator schemas
4. **Efficient Queries**: Single query can fetch all types or filter by category
5. **Schema Flexibility**: Easy to add new categories without structural changes

#### Base Schema (All Categories)
```javascript
{
  eventName: String (required),
  eventType: Enum (required),
  eventTypeOther: String (optional),
  dateMode: Enum ['single', 'range'] (required),
  eventDate: Date (conditional),
  startDate: Date (conditional),
  endDate: Date (conditional),
  location: String (required),
  venue: String (optional),
  category: Enum ['planner', 'performer', 'crew'] (required),
  status: Enum ['open', 'closed', 'in-progress'] (default: 'open'),
  timestamps: true
}
```

#### Planner Discriminator
```javascript
{
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
}
```

#### Performer Discriminator
```javascript
{
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
}
```

#### Crew Discriminator
```javascript
{
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
}
```

#### Indexes
```javascript
{ category: 1, createdAt: -1 }  // Optimized for category filtering and sorting
```

## 🌐 Deployment

### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Configure Network Access:
   - Add `0.0.0.0/0` to allow connections from anywhere (for development)
   - For production, whitelist specific IPs
3. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/requirement_posting
   ```

### Backend Deployment (Render)

1. **Create Web Service:**
   - Platform: Render.com
   - Repository: Connect your GitHub repo
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Environment Variables:**
   ```
   NODE_VERSION=20
   MONGODB_URI=mongodb+srv://...
   CORS_ORIGIN=https://your-frontend.vercel.app
   PORT=5000
   ```

3. **Note:** Render free tier has ~50 second cold start delay on first request after inactivity.

### Frontend Deployment (Vercel)

1. **Connect Repository:**
   - Platform: Vercel.com
   - Import your GitHub repository
   - Root Directory: `frontend`
   - Framework Preset: Next.js

2. **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api/v1
   ```

3. **Deploy:**
   - Vercel automatically builds and deploys on push to main branch

## 🧪 Testing

### Backend Tests

Run all tests:
```bash
cd backend
npm test
```

**Test Coverage:**
- ✅ Health endpoint validation
- ✅ Zod schema validation for all 3 categories
- ✅ Cross-field validation (dates, budgets, shifts)
- ✅ Strict mode enforcement (unknown fields rejected)
- ✅ Controller logic with mocked models
- ✅ Error handling and response format

**Test Results:**
```
Test Suites: 1 passed, 1 total
Tests:       11 passed, 11 total
```

### Frontend Build Verification

```bash
cd frontend
npm run build
```

Confirms:
- ✅ Zero compilation errors
- ✅ All pages render correctly
- ✅ Linting passes
- ✅ Production build optimization

## 📝 Assumptions

1. **User Authentication**: Not implemented; assumes public posting without auth
2. **Event Dates**: Must be in the future (validated on submission)
3. **Budget**: Planner budgetMax must be >= budgetMin
4. **Shift Times**: Crew shift end must be after shift start
5. **Date Ranges**: End date must be >= start date
6. **Numeric Fields**: Coerced from strings (e.g., form inputs)
7. **Category Selection**: Changing category after filling steps 2-3 requires confirmation
8. **LocalStorage**: Used for draft persistence (client-side only)
9. **API Timeout**: 15 seconds for all API requests
10. **Rate Limiting**: 100 requests per 15 minutes per IP
11. **Request Size**: Limited to 100KB JSON payload
12. **MongoDB**: Connection failure exits server with code 1

## 🛡 Edge Cases Handled

1. **Invalid Object IDs**: Returns 400 with clear error message
2. **Missing Required Fields**: Zod validation provides field-specific errors
3. **Budget Validation**: Prevents budgetMax < budgetMin
4. **Date Validation**: 
   - Prevents past dates
   - Ensures endDate >= startDate
   - Validates shift times (end > start)
5. **Event Type "Other"**: Requires eventTypeOther field
6. **Unknown Fields**: Strict mode rejects extra fields
7. **Category Change**: Confirms and clears steps 2-3 data
8. **Pagination**: Enforces max 50 items per page
9. **Network Errors**: Frontend displays user-friendly error messages
10. **Double Submit**: Submit button disabled during API call
11. **LocalStorage Errors**: Gracefully handled with try-catch
12. **SSR Hydration**: Store only persists on client side

## ⚠️ Limitations

1. **No Authentication**: Anyone can post requirements
2. **No Edit/Delete**: Requirements cannot be modified after creation
3. **No Image Upload**: Text-only requirements
4. **No Real-time Updates**: Manual refresh needed for new data
5. **No Email Notifications**: No automated alerts
6. **No Search**: Basic category filtering only
7. **No Payment Integration**: Budget/fee fields are informational only
8. **No Booking System**: No way to accept/fulfill requirements
9. **No User Profiles**: No user accounts or history
10. **No Admin Panel**: No moderation tools
11. **Limited Validation**: Past date check uses client time
12. **No File Attachments**: Cannot upload contracts or media

## 🚀 Future Improvements

1. **Authentication & Authorization**
   - User registration and login
   - Role-based access control
   - OAuth integration (Google, Facebook)

2. **Enhanced Features**
   - Edit and delete requirements
   - Image and document uploads
   - Real-time updates with WebSockets
   - Advanced search and filtering
   - Save draft functionality
   - Email notifications

3. **Business Logic**
   - Booking and fulfillment system
   - Payment integration (Stripe)
   - Review and rating system
   - Messaging between parties
   - Calendar integration

4. **Technical Improvements**
   - GraphQL API
   - Server-side rendering for SEO
   - Progressive Web App (PWA)
   - Automated E2E testing (Playwright)
   - CI/CD pipeline
   - Monitoring and analytics
   - CDN for static assets

5. **User Experience**
   - Mobile app (React Native)
   - Multi-language support
   - Accessibility improvements (WCAG AA)
   - Dark mode
   - Onboarding tutorial

6. **Data & Analytics**
   - Admin dashboard
   - Usage analytics
   - Export to CSV/PDF
   - Reporting tools

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👥 Contributors

Built with ❤️ following exact specifications for a working, error-free monorepo.

---

**Version**: 1.0.0  
**Last Updated**: October 10, 2026
