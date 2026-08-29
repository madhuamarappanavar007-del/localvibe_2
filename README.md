# LocalVibe — Hyperlocal Event Discovery Platform

LocalVibe is a map-first event discovery application for finding nearby community events such as markets, live music, food pop-ups, sports meetups, and neighborhood experiences. The project combines a Node/Express API, MongoDB geospatial queries, and a React/Vite frontend to deliver a practical local-event browsing and creation workflow.

## Table of Contents

- [Problem and Goals](#problem-and-goals)
- [Features Implemented](#features-implemented)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Core Implementation](#core-implementation)
- [Environment Variables](#environment-variables)
- [Local Setup Instructions](#local-setup-instructions)
- [Production Deployment](#production-deployment)
- [API Endpoints](#api-endpoints)
- [Security Implementation](#security-implementation)
- [Demo Limitations](#demo-limitations)
- [Future Enhancements](#future-enhancements)

## Problem and Goals

The project addresses the need for a simple but complete local event discovery platform where users can:

- Browse events near them
- Search and filter by category, date, price and keywords
- RSVP to events
- See friends attending and personalized suggestions
- Create, edit and delete own events
- View events on an interactive map

## Features Implemented

### Event Discovery & Management
- MongoDB + Mongoose event schema with geospatial indexing
- Express REST API for events, users, RSVP, geocoding and recommendations
- Event discovery with keyword, category, date, price and nearby-radius filters
- Robust image fallback handling for event cards and overlays

### Map & Location
- Interactive Leaflet map with markers and popups for event visualization
- Browser geolocation support for current position detection
- MongoDB 2dsphere geospatial index with $near queries for nearby events
- Real-time distance calculation between user and events
- Featured event markers with distinct styling

### Event Interaction
- Event creation form with address autocomplete via Nominatim
- Interactive coordinate selection on map during event creation
- Event detail overlay with full metadata, organizer info, and distance
- Edit and delete controls (available to event organizers)
- RSVP state tracking for Going / Interested / Cancel statuses
- Friends-going feature to see which social contacts are attending

### User & Recommendation System
- Demo user-selection system (see [Demo Limitations](#demo-limitations))
- User profile panel with organized events, RSVPs and attendance history
- Personalized event recommendations based on attended categories
- User following/network relationships for friends-going functionality
- Attended category tracking from RSVP history

### UI/UX
- Responsive design for desktop and mobile layouts
- Clear loading, error and empty states
- Category filter with multi-category selection
- Date range filtering (start and end date)
- Price range filtering
- Featured event highlighting
- Radius-based filtering for nearby search

## Technology Stack

**Frontend:**
- React 18.3 (UI framework)
- Vite 5.4 (build tool and dev server)
- Leaflet 1.9 (interactive maps)
- react-leaflet 4.2 (React bindings for Leaflet)
- Custom CSS (responsive styling)

**Backend:**
- Node.js (runtime)
- Express 4.21 (web framework)
- Mongoose 9.0 (MongoDB ODM)
- CORS 2.8 (cross-origin support)
- dotenv 16.4 (environment configuration)

**Database:**
- MongoDB Atlas (cloud hosted)
- 2dsphere geospatial indexing
- Replica set support (native to Atlas)

**External Services:**
- OpenStreetMap Nominatim (geocoding and address autocomplete)
- OpenStreetMap tiles (map base layer)
- External image URLs (event photos)

## Project Architecture

### Backend Structure
```
backend/
├── server.js              # Express app initialization, CORS, security headers
├── config/db.js          # MongoDB connection with retry logic
├── models/
│   ├── Event.js          # Event schema with geospatial index
│   └── User.js           # User schema with following relationships
└── routes/
    ├── events.js         # Event CRUD, filtering, search, nearby
    ├── users.js          # User CRUD, profile, following
    ├── rsvp.js           # RSVP status updates, friends-going
    └── geocode.js        # Nominatim reverse proxy with timeout
```

### Frontend Structure
```
frontend/
├── src/
│   ├── App.jsx           # Main component, app state orchestration
│   ├── main.jsx          # React entry point
│   ├── components/
│   │   ├── EventList.jsx     # List view with filters
│   │   ├── EventForm.jsx     # Create/edit event form
│   │   ├── EventMap.jsx      # Leaflet map with markers
│   │   ├── Filters.jsx       # Category, date, price filters
│   │   └── UserProfile.jsx   # User profile and recommendations
│   ├── services/
│   │   └── api.js        # Centralized API client
│   └── styles/
│       └── index.css     # Responsive CSS
├── index.html            # HTML entry point
└── vite.config.js        # Vite build configuration
```

## Core Implementation

### MongoDB Geospatial Implementation
Events are stored with a GeoJSON location:
```javascript
location: {
  address: String,
  coordinates: {
    type: "Point",
    coordinates: [lng, lat]  // Note: [longitude, latitude]
  }
}
```

The 2dsphere index enables efficient proximity queries:
```javascript
eventSchema.index({ 'location.coordinates': '2dsphere' });
```

Nearby event queries use `$near` with `$maxDistance`:
```javascript
'location.coordinates': {
  $near: {
    $geometry: { type: 'Point', coordinates: [lng, lat] },
    $maxDistance: radiusKm * 1000  // Meters
  }
}
```

### Event Filtering System
Multiple filter types work together:
- **Geospatial:** Nearby search via radius (default 5 km)
- **Category:** Single or filtered by multiple event types
- **Temporal:** Start/end date range filtering
- **Price:** Min/max price range
- **Keyword:** Full-text search in title and description
- **Featured:** Show only featured/highlighted events

### RSVP & Recommendation Logic
- Users can mark events as "going" or "interested"
- Going status updates `user.attendedCategories` array
- Recommendations fetch events in user's attended categories
- Results are geospatially filtered if user coordinates are provided
- Limit of 12 recommended events per request

### Geocoding with Resilience
- Nominatim requests have a 5-second timeout (AbortController)
- Timeout failures return HTTP 504 "Geocoding service timeout"
- Backend proxies requests to avoid browser CORS issues
- Results include display name and parsed coordinates

## Environment Variables

### Backend (`backend/.env`)

**Required:**
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/localvibe?retryWrites=true&w=majority
NODE_ENV=development|production
FRONTEND_URL=http://localhost:5173  (dev) or https://your-domain.com (prod)
```

**Security Notes:**
- Never commit `.env` files containing real credentials
- Use `.env.example` for configuration templates
- In production, use secure secrets management (AWS Secrets Manager, GitHub Secrets, etc.)
- Ensure HTTPS for production MongoDB connections

### Frontend (`frontend/.env`)

**Optional:**
```
VITE_API_URL=http://localhost:5000/api  (dev) or leave empty for same-origin (prod)
```

**Behavior:**
- If `VITE_API_URL` is set, requests go to that URL
- If empty or undefined, requests use relative path `/api`
- Relative paths work when frontend and backend share the same origin (e.g., both on Vercel/Render)

## Local Setup Instructions

### Prerequisites
- Node.js 18+ with npm
- MongoDB Atlas account (or local MongoDB instance)
- Internet connection (for Nominatim geocoding)

### Step 1: Clone and Install
```bash
cd C:\Users\HP\Projects\localvibe_2
npm run install:all
```

### Step 2: Configure Backend
Create `backend/.env`:
```bash
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/localvibe?retryWrites=true&w=majority
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 3: (Optional) Seed Test Data
```bash
npm run seed
```

### Step 4: Start Development Services

**Terminal 1 - Backend:**
```bash
npm run dev:backend
# Backend runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
# Frontend runs on http://localhost:5173
```

Visit `http://localhost:5173` in your browser.

### Step 5: Production Build
```bash
npm run build  # Frontend only
npm start      # Backend only (requires NODE_ENV=production)
```

## Production Deployment

### Architecture
```
Frontend (Vercel)
    ↓ (API calls)
Backend (Render)
    ↓ (queries)
Database (MongoDB Atlas)
```

### Backend Deployment (Render)

1. **Create Render Service**
   - Connect GitHub repository
   - Service type: Web Service
   - Build command: `npm install --prefix backend`
   - Start command: `npm start --prefix backend`

2. **Environment Variables** (Render Dashboard)
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://<prod-user>:<prod-password>@cluster.mongodb.net/localvibe?retryWrites=true&w=majority
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

3. **MongoDB Atlas Configuration**
   - Add Render deployment IP to Atlas Network Access whitelist
   - Enable IP access restrictions in Production

4. **HTTPS**
   - Render automatically provides HTTPS
   - Verify Strict-Transport-Security header is sent

### Frontend Deployment (Vercel)

1. **Connect Repository**
   - Connect GitHub to Vercel
   - Select `localvibe_2` repository

2. **Build Settings**
   - Framework: Vite
   - Build command: `npm run build --prefix frontend`
   - Output directory: `frontend/dist`

3. **Environment Variables** (Vercel Dashboard)
   ```
   VITE_API_URL=https://your-backend-domain.onrender.com/api
   ```
   OR leave empty if using same-origin deployment.

4. **Deployment**
   - Vercel automatically builds on push to main
   - Production URL: `https://localvibe-<random>.vercel.app`

### Database (MongoDB Atlas)

1. **Create Cluster**
   - Use M0 free tier for demo
   - Enable Public IP access (with whitelist)
   - Create database user with strong password

2. **Network Access**
   - Whitelist Render deployment IP
   - Whitelist local development IP (if needed)
   - Add `0.0.0.0/0` ONLY for development

3. **Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/localvibe?retryWrites=true&w=majority
   ```

4. **Backups**
   - Enable automated backups (Atlas feature)
   - Schedule regular exports for critical data

## API Endpoints

### Events
- `GET /api/events` - List all events (with filters: category, q, startDate, endDate, minPrice, maxPrice, featured)
- `GET /api/events/:id` - Get event details
- `GET /api/events/categories` - List valid categories
- `GET /api/events/nearby?lat=X&lng=Y&radius=5` - Nearby events (default 5 km)
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### RSVP
- `POST /api/events/:eventId/rsvp` - Update RSVP status (body: {userId, status})
- `GET /api/events/:eventId/friends-going?userId=X` - Get friends attending

### Users
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user profile
- `POST /api/users` - Create user
- `POST /api/users/:id/follow/:targetId` - Follow user
- `GET /api/users/:id/events` - Get user's organized/attending/interested events

### Recommendations
- `GET /api/events/recommendations/:userId?lat=X&lng=Y` - Get personalized recommendations

### Geocoding
- `GET /api/geocode?q=<search>` - Address search via Nominatim (5-second timeout)

### Health
- `GET /api/health` - API health check

## Security Implementation

### Implemented Safeguards

1. **PII Protection**
   - User email addresses removed from all public API responses
   - Only `_id`, `name`, `avatar` returned for users
   - User email field excluded with `.select('-email')`

2. **Error Sanitization**
   - Raw `err.message` never sent to clients
   - All 500 errors return: `{ error: "Internal server error" }`
   - Stack traces logged server-side for debugging

3. **ObjectId Validation**
   - All route parameters accepting MongoDB IDs validated before query
   - Invalid IDs return HTTP 400 with safe message
   - Prevents malformed query attempts

4. **CORS Configuration**
   - **Development:** Localhost origins allowed
   - **Production:** Strict origin validation against `FRONTEND_URL` only
   - No wildcard `*` origin in production
   - Invalid origins return 403 error

5. **Security Headers**
   - `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
   - `X-Frame-Options: DENY` - Prevents clickjacking
   - `X-XSS-Protection: 1; mode=block` - Browser XSS protection
   - `Strict-Transport-Security: max-age=31536000` - Enforces HTTPS

6. **External Request Resilience**
   - Nominatim geocoder requests have 5-second timeout
   - Prevents hanging from slow external service
   - HTTP 504 returned on timeout

7. **Environment Secrets**
   - `.env` files in `.gitignore`
   - Database credentials never hardcoded
   - No API keys in source code

### What IS NOT Included

**Authentication:**
This is a **demo application**. Real authentication (JWT, OAuth2, Passport.js) is NOT implemented. Any user can create/edit any event. See [Demo Limitations](#demo-limitations).

## Demo Limitations

### User System
- **Current:** Simple demo user-selection dropdown
- **Not Real Authentication:** Any user can impersonate any other user by selecting them
- **For Demo Only:** Suitable for showcasing features, not for real deployments
- **Future:** Real authentication required for production

### Data Model
- **Single MongoDB Instance:** No multi-tenant isolation
- **No Authorization:** Users can edit any event (authorization missing)
- **Demo Data:** Seed data is public and may be modified by any visitor

### External Dependencies
- **Nominatim (OpenStreetMap):** Free tier with rate limits
  - Recommended ~1 request per second
  - For production, consider commercial geocoding service
- **OpenStreetMap Tiles:** Free tiles for map rendering
  - Subject to their usage policy
  - For high-traffic sites, use commercial tile provider
- **External Image URLs:** Event photos from external URLs
  - Images may break if external links become unavailable
  - Fallback to default placeholder when broken

### Scalability
- **Single-threaded Node:** No cluster mode
- **Single Database Connection:** No read replicas configured
- **No Caching:** Every request queries database
- **No Rate Limiting:** Public endpoints available without throttling

## Future Enhancements

### High Priority
1. **Real Authentication**
   - JWT or OAuth2 implementation
   - User signup/login flow
   - Password reset functionality
   - Email verification

2. **Authorization**
   - Users can only edit their own events
   - Admin functionality for moderation
   - Role-based access control (RBAC)

3. **Production Monitoring**
   - Error tracking (Sentry, DataDog)
   - Performance monitoring (APM)
   - Application logging
   - Alert system

### Medium Priority
4. **Testing**
   - Unit tests for API routes
   - Integration tests for database operations
   - Frontend component tests
   - E2E tests with Cypress/Playwright

5. **Recommendation Ranking**
   - Machine learning ranking (collaborative filtering)
   - User preference modeling
   - Event popularity scoring
   - Time-decay for older events

6. **Rate Limiting**
   - express-rate-limit middleware
   - Per-IP rate limiting
   - Per-user rate limiting
   - API key authentication

7. **Caching Strategy**
   - Redis for frequently accessed data
   - Browser caching headers
   - CDN for frontend assets
   - Database query result caching

### Lower Priority
8. **Mobile App**
   - React Native version
   - Push notifications
   - Offline event list

9. **Search Improvements**
   - Elasticsearch integration
   - Typo tolerance
   - Advanced filters

10. **Social Features**
    - Event comments/discussion
    - User ratings/reviews
    - Share to social media
    - Event invitations
