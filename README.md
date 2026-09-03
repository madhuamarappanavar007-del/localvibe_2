# LocalVibe — Hyperlocal Event Discovery Platform

LocalVibe is a map-first event discovery application for finding nearby community events such as markets, live music, food pop-ups, sports meetups, and neighborhood experiences. The project combines a Node.js/Express API, MongoDB geospatial queries, and a React/Vite frontend to deliver a practical local-event browsing and creation workflow.

## Table of Contents

* [Problem and Goals](#problem-and-goals)
* [Features Implemented](#features-implemented)
* [Technology Stack](#technology-stack)
* [Project Architecture](#project-architecture)
* [Core Implementation](#core-implementation)
* [Environment Variables](#environment-variables)
* [Local Setup Instructions](#local-setup-instructions)
* [Production Deployment](#production-deployment)
* [API Endpoints](#api-endpoints)
* [Security Implementation](#security-implementation)
* [Demo Limitations](#demo-limitations)
* [Future Enhancements](#future-enhancements)

## Problem and Goals

The project addresses the need for a simple but complete local event discovery platform where users can:

* Browse events near them
* Search and filter by category, date, price, and keywords
* RSVP to events
* See friends attending and personalized suggestions
* Create, edit, and delete events
* View events on an interactive map

## Features Implemented

### Event Discovery & Management

* MongoDB + Mongoose event schema with geospatial indexing
* Express REST API for events, users, RSVP, geocoding, and recommendations
* Event discovery with keyword, category, date, price, and nearby-radius filters
* Robust image fallback handling for event cards and overlays
* Event creation, editing, and deletion functionality

### Map & Location

* Interactive Leaflet map with markers and popups for event visualization
* Browser geolocation support for current position detection
* MongoDB 2dsphere geospatial index with `$near` queries for nearby events
* Real-time distance calculation between user and events
* Featured event markers with distinct styling
* Interactive coordinate selection during event creation

### Event Interaction

* Event creation form with address autocomplete via Nominatim
* Interactive coordinate selection on map during event creation
* Event detail overlay with full metadata, organizer information, and distance
* Event editing and deletion controls
* RSVP state tracking for Going / Interested / Cancel statuses
* Friends-going feature to see which social contacts are attending

### User & Recommendation System

* Demo user-selection system (see [Demo Limitations](#demo-limitations))
* User profile panel with organized events, RSVPs, and attendance history
* Personalized event recommendations based on attended categories
* User following/network relationships for friends-going functionality
* Attended category tracking from RSVP history

### UI/UX

* Responsive design for desktop and mobile layouts
* Clear loading, error, and empty states
* Category filter with multi-category selection
* Date range filtering (start and end date)
* Price range filtering
* Featured event highlighting
* Radius-based filtering for nearby search

## Technology Stack

**Frontend:**

* React 18.3 (UI framework)
* Vite 5.4 (build tool and development server)
* Leaflet 1.9 (interactive maps)
* react-leaflet 4.2 (React bindings for Leaflet)
* Custom CSS (responsive styling)

**Backend:**

* Node.js (runtime)
* Express 4.21 (web framework)
* Mongoose 9.0 (MongoDB ODM)
* CORS 2.8 (cross-origin support)
* dotenv 16.4 (environment configuration)

**Database:**

* MongoDB Atlas (cloud hosted)
* 2dsphere geospatial indexing
* Replica set support (native to Atlas)

**External Services:**

* OpenStreetMap Nominatim (geocoding and address autocomplete)
* OpenStreetMap tiles (map base layer)
* External image URLs (event photos)

## Project Architecture

### Deployment Architecture

```text
Frontend (Render)
    ↓ (API calls)
Backend (Render)
    ↓ (queries)
Database (MongoDB Atlas)
```

### Backend Structure

```text
backend/
├── server.js              # Express app initialization, CORS, security headers
├── config/db.js           # MongoDB connection with retry logic
├── models/
│   ├── Event.js           # Event schema with geospatial index
│   └── User.js            # User schema with following relationships
└── routes/
    ├── events.js          # Event CRUD, filtering, search, nearby
    ├── users.js           # User CRUD, profile, following
    ├── rsvp.js            # RSVP status updates, friends-going
    └── geocode.js         # Nominatim reverse proxy with timeout
```

### Frontend Structure

```text
frontend/
├── src/
│   ├── App.jsx               # Main component, app state orchestration
│   ├── main.jsx              # React entry point
│   ├── components/
│   │   ├── EventList.jsx     # List view with filters
│   │   ├── EventForm.jsx     # Create/edit event form
│   │   ├── EventMap.jsx      # Leaflet map with markers
│   │   ├── Filters.jsx       # Category, date, price filters
│   │   └── UserProfile.jsx   # User profile and recommendations
│   ├── services/
│   │   └── api.js            # Centralized API client
│   └── styles/
│       └── index.css         # Responsive CSS
├── index.html                # HTML entry point
└── vite.config.js            # Vite configuration
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
    $geometry: {
      type: 'Point',
      coordinates: [lng, lat]
    },
    $maxDistance: radiusKm * 1000  // Meters
  }
}
```

### Event Filtering System

Multiple filter types work together:

* **Geospatial:** Nearby search via radius (default 5 km)
* **Category:** Single or multiple event-type filtering
* **Temporal:** Start/end date range filtering
* **Price:** Minimum and maximum price range
* **Keyword:** Search in title and description
* **Featured:** Show only featured/highlighted events

### RSVP & Recommendation Logic

* Users can mark events as "Going" or "Interested"
* Going status updates the user's `attendedCategories` array
* Recommendations fetch events in the user's attended categories
* Results can be geospatially filtered when user coordinates are provided
* Recommendations are limited to 12 events per request

### Geocoding with Resilience

* Nominatim requests have a 5-second timeout using `AbortController`
* Timeout failures return HTTP 504 with a safe timeout message
* Backend proxies requests to avoid browser CORS issues
* Results include display name and parsed coordinates

## Environment Variables

### Backend (`backend/.env`)

**Required:**

```text
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/localvibe?retryWrites=true&w=majority
NODE_ENV=development|production
FRONTEND_URL=http://localhost:5173
```

For production, `FRONTEND_URL` should contain the deployed Render frontend URL:

```text
FRONTEND_URL=https://localvibe-frontend-a2x1.onrender.com
```

**Security Notes:**

* Never commit `.env` files containing real credentials
* Use `.env.example` for configuration templates
* In production, use secure secrets management where appropriate
* Ensure HTTPS is used for production services

### Frontend (`frontend/.env`)

**Optional for local development:**

```text
VITE_API_URL=http://localhost:5000/api
```

**Production:**

```text
VITE_API_URL=https://localvibe-backend-2026.onrender.com/api
```

**Behavior:**

* If `VITE_API_URL` is set, API requests are sent to that URL
* If empty or undefined, requests use the relative `/api` path
* Because the production frontend and backend are deployed as separate Render services, the production frontend uses the deployed backend URL through `VITE_API_URL`

## Local Setup Instructions

### Prerequisites

* Node.js 18+ with npm
* MongoDB Atlas account or local MongoDB instance
* Internet connection for Nominatim geocoding

### Step 1: Clone and Install

```bash
cd C:\Users\HP\Projects\localvibe_2
npm run install:all
```

### Step 2: Configure Backend

Create `backend/.env`:

```text
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/localvibe?retryWrites=true&w=majority
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Step 3: Optional Seed Test Data

```bash
npm run seed
```

### Step 4: Start Development Services

**Terminal 1 — Backend:**

```bash
npm run dev:backend
```

Backend runs on:

```text
http://localhost:5000
```

**Terminal 2 — Frontend:**

```bash
npm run dev:frontend
```

Frontend runs on:

```text
http://localhost:5173
```

Visit the frontend URL in your browser.

### Step 5: Production Build

```bash
npm run build
```

This builds the frontend.

The backend can be started in production with:

```bash
npm start
```

when the required production environment variables are configured.

## Production Deployment

### Production Architecture

```text
Frontend (Render)
    ↓ HTTPS API calls
Backend (Render)
    ↓ MongoDB connection
Database (MongoDB Atlas)
```

### Backend Deployment — Render

1. Create a Render Web Service.
2. Connect the GitHub repository.
3. Configure the service to use the backend application.

**Build command:**

```text
npm install --prefix backend
```

**Start command:**

```text
npm start --prefix backend
```

### Backend Environment Variables

Configure the following in the Render Dashboard:

```text
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<prod-user>:<prod-password>@cluster.mongodb.net/localvibe?retryWrites=true&w=majority
FRONTEND_URL=https://localvibe-frontend-a2x1.onrender.com
```

### MongoDB Atlas Configuration

* Configure MongoDB Atlas Network Access for the deployed backend
* Use a dedicated database user
* Use a strong database password
* Keep database credentials in environment variables
* Do not commit MongoDB credentials to GitHub

### HTTPS

Render provides HTTPS for deployed services.

The production deployment should be accessed using HTTPS URLs.

### Frontend Deployment — Render

The LocalVibe frontend is deployed as a separate Render service.

1. Create a Render Static Site.
2. Connect the GitHub repository.
3. Select the LocalVibe repository.
4. Configure the frontend build.

**Build command:**

```text
npm install --prefix frontend && npm run build --prefix frontend
```

**Publish directory:**

```text
frontend/dist
```

### Frontend Environment Variable

Configure the following environment variable for the Render frontend service:

```text
VITE_API_URL=https://localvibe-backend-2026.onrender.com/api
```

The deployed frontend uses this URL to communicate with the production backend.

### Production URLs

**Frontend:**

```text
https://localvibe-frontend-a2x1.onrender.com
```

**Backend:**

```text
https://localvibe-backend-2026.onrender.com
```

**Health Check:**

```text
https://localvibe-backend-2026.onrender.com/api/health
```

## API Endpoints

### Events

* `GET /api/events` — List all events with optional filters
* `GET /api/events/:id` — Get event details
* `GET /api/events/categories` — List valid categories
* `GET /api/events/nearby?lat=X&lng=Y&radius=5` — Find nearby events
* `POST /api/events` — Create an event
* `PUT /api/events/:id` — Update an event
* `DELETE /api/events/:id` — Delete an event

Supported event filters include:

* `category`
* `q`
* `startDate`
* `endDate`
* `minPrice`
* `maxPrice`
* `featured`
* nearby radius

### RSVP

* `POST /api/events/:eventId/rsvp` — Update RSVP status
* `GET /api/events/:eventId/friends-going?userId=X` — Get friends attending

Example RSVP body:

```json
{
  "userId": "USER_ID",
  "status": "going"
}
```

Supported statuses include:

```text
going
interested
cancel
```

### Users

* `GET /api/users` — List users
* `GET /api/users/:id` — Get user profile
* `POST /api/users` — Create user
* `POST /api/users/:id/follow/:targetId` — Follow a user
* `GET /api/users/:id/events` — Get user's organized, attending, and interested events

### Recommendations

```text
GET /api/events/recommendations/:userId?lat=X&lng=Y
```

Returns personalized event recommendations based on the user's attendance history and available location information.

### Geocoding

```text
GET /api/geocode?q=<search>
```

Searches addresses using the Nominatim geocoding service.

The backend applies a 5-second timeout to external geocoding requests.

### Health

```text
GET /api/health
```

Used to verify backend availability.

## Security Implementation

### Implemented Safeguards

#### 1. PII Protection

* User email addresses are removed from public API responses
* Public user information is limited to appropriate fields such as `_id`, `name`, and `avatar`
* User email fields are excluded from relevant queries

#### 2. Error Sanitization

* Raw internal error messages are not returned to clients
* Server errors return a generic response:

```json
{
  "error": "Internal server error"
}
```

* Detailed errors can be logged server-side for debugging

#### 3. ObjectId Validation

* Route parameters accepting MongoDB IDs are validated before database queries
* Invalid IDs return a safe HTTP 400 response
* Helps prevent malformed database queries

#### 4. CORS Configuration

* Development allows configured localhost origins
* Production validates requests against the configured `FRONTEND_URL`
* Wildcard `*` origin is not used for production access
* Invalid origins are rejected

#### 5. Security Headers

The backend applies security-related HTTP headers including:

* `X-Content-Type-Options: nosniff`
* `X-Frame-Options: DENY`
* `X-XSS-Protection`
* `Strict-Transport-Security`

These headers help reduce common browser-side security risks.

#### 6. External Request Resilience

* Nominatim geocoder requests use a 5-second timeout
* Prevents requests from hanging indefinitely
* Timeout failures return an appropriate HTTP 504 response

#### 7. Environment Secrets

* `.env` files are included in `.gitignore`
* Database credentials are not hardcoded
* Production secrets are configured through deployment environment variables
* No database credentials or private API keys are stored in the public repository

### Authentication Status

This project is currently a **demo application** and does not implement production-grade authentication.

Real authentication mechanisms such as JWT, OAuth2, or Passport.js are planned as future enhancements.

## Demo Limitations

### User System

* **Current:** Simple demo user-selection dropdown
* **Authentication:** Real login and identity verification are not implemented
* **User impersonation:** A visitor can select another demo user
* **Purpose:** The system is intended for academic demonstration and project evaluation
* **Future:** Real authentication and authorization should be implemented before production use

### Authorization

* The current demo does not provide complete role-based authorization
* Event modification permissions are not protected by production-grade authentication
* A production system should restrict event modification to authorized users
* Admin moderation and role-based access control are not implemented

### Data Model

* **Single MongoDB Instance:** No multi-tenant isolation
* **Demo Data:** Seed data is public and may be modified through the available demo functionality
* **No production identity management:** Users are represented through the demo user system

### External Dependencies

**Nominatim / OpenStreetMap:**

* Free service with usage limits
* Recommended to respect Nominatim's usage policy
* For production-scale applications, a commercial geocoding provider may be preferable

**OpenStreetMap Tiles:**

* Free map tiles are used for the project
* Usage is subject to OpenStreetMap tile usage policies
* High-traffic production deployments may require a dedicated tile provider

**External Image URLs:**

* Event photos are loaded from external image URLs
* Images may become unavailable if external links change
* Fallback handling is implemented for broken images

### Scalability

* Single-threaded Node.js application
* Single primary database connection
* No Redis or distributed caching
* No production-grade rate limiting
* Public demo endpoints are not designed for high-volume production traffic

## Future Enhancements

### High Priority

1. **Real Authentication**

   * JWT or OAuth2 implementation
   * User signup and login
   * Password reset functionality
   * Email verification

2. **Authorization**

   * Restrict event editing and deletion to authorized owners
   * Admin functionality for moderation
   * Role-based access control (RBAC)

3. **Production Monitoring**

   * Error tracking with services such as Sentry
   * Application performance monitoring
   * Structured application logging
   * Alerting system

### Medium Priority

4. **Testing**

   * Unit tests for API routes
   * Integration tests for database operations
   * Frontend component tests
   * End-to-end tests using Cypress or Playwright

5. **Recommendation Ranking**

   * Machine learning-based event ranking
   * Collaborative filtering
   * User preference modeling
   * Event popularity scoring
   * Time-decay for older events

6. **Rate Limiting**

   * `express-rate-limit`
   * Per-IP rate limiting
   * Per-user rate limiting
   * API key authentication where appropriate

7. **Caching Strategy**

   * Redis for frequently accessed data
   * Browser caching headers
   * CDN for frontend assets
   * Database query-result caching

### Lower Priority

8. **Mobile Application**

   * React Native version
   * Push notifications
   * Offline event browsing

9. **Search Improvements**

   * Elasticsearch integration
   * Typo tolerance
   * Advanced search filters

10. **Social Features**

    * Event comments and discussions
    * User ratings and reviews
    * Social media sharing
    * Event invitations
