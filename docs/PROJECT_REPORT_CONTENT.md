# LocalVibe Project Report Content

## 1. Title

**LocalVibe – Hyperlocal Event Discovery Platform**

## 2. Abstract

LocalVibe is a full-stack web application designed to solve the problem of discovering local events in an efficient and user-friendly manner. The application combines a React frontend, Express backend, and MongoDB Atlas database with geospatial capabilities to enable users to discover, create, and interact with nearby community events. The system features interactive map visualization, geolocation-based search, event filtering, RSVP functionality, and personalized recommendations. This project demonstrates the practical application of modern web technologies, geospatial databases, and RESTful API design to create a functional event discovery platform.

## 3. Introduction

In today's fast-paced world, people often miss out on local events happening in their community due to lack of awareness and fragmented information sources. Social media platforms, local newspapers, and community boards often provide event information in scattered formats, making it difficult for users to discover events relevant to their interests and location. LocalVibe addresses this challenge by providing a centralized, map-based platform for discovering and interacting with local events.

## 4. Problem Statement

The existing event discovery landscape faces several challenges:

1. **Fragmented Information Sources:** Event information is scattered across multiple platforms (Facebook Events, Meetup, local newspapers, community boards)
2. **Location-Based Discovery:** Difficulty finding events happening near a specific location
3. **Category-Based Filtering:** Limited ability to filter events by interest categories
4. **Real-Time Updates:** Lack of up-to-date information about event changes and cancellations
5. **Social Interaction:** Limited ability to see which friends are attending events
6. **RSVP Management:** No centralized system for tracking event attendance
7. **Mobile Accessibility:** Poor mobile experience for on-the-go event discovery

## 5. Motivation

The motivation for developing LocalVibe stems from the need for a unified, user-friendly platform that addresses the limitations of existing event discovery solutions. By leveraging modern web technologies and geospatial databases, LocalVibe aims to provide:

- A centralized hub for local event information
- Location-based event discovery using geospatial queries
- Interactive map visualization for better spatial understanding
- Social features for community engagement
- A responsive design that works across devices
- Real-time RSVP tracking and management

## 6. Objectives

The primary objectives of LocalVibe are:

1. **Event Discovery:** Enable users to discover local events based on location, category, date, and other criteria
2. **Event Creation:** Allow users to create and manage their own events
3. **Geospatial Search:** Implement efficient location-based event search using MongoDB geospatial indexing
4. **Interactive Mapping:** Provide an interactive map interface for visualizing event locations
5. **RSVP System:** Implement a robust RSVP system for tracking event attendance
6. **User Profiles:** Create user profiles with event history and recommendations
7. **Responsive Design:** Ensure the application works seamlessly across desktop, tablet, and mobile devices
8. **RESTful API:** Design and implement a clean RESTful API for frontend-backend communication
9. **Security:** Implement appropriate security measures including CORS, input validation, and error handling
10. **Deployment:** Deploy the application to a cloud platform for production use

## 7. Existing System

Currently, users rely on multiple platforms for event discovery:

- **Social Media:** Facebook Events, Meetup, Eventbrite
- **Local Media:** Newspapers, radio, television
- **Community Boards:** Physical notice boards, community websites
- **Word of Mouth:** Personal recommendations and social networks

Each of these systems has its own limitations in terms of accessibility, searchability, and user experience.

## 8. Existing System Limitations

1. **Fragmentation:** Information scattered across multiple platforms
2. **Inconsistent UX:** Different user interfaces and navigation patterns
3. **Limited Search:** Poor search and filtering capabilities
4. **No Geospatial Features:** Limited location-based discovery
5. **Account Requirements:** Users need accounts on multiple platforms
6. **No Central RSVP:** No unified RSVP tracking system
7. **Poor Mobile Experience:** Many platforms not optimized for mobile
8. **No Personalization:** Limited recommendation features
9. **Information Silos:** Events not shared between platforms
10. **Real-Time Issues:** Difficulty keeping information current

## 9. Proposed System

LocalVibe proposes a unified, web-based event discovery platform that addresses these limitations through:

- **Centralized Database:** Single source of truth for event information
- **Geospatial Search:** MongoDB 2dsphere indexing for efficient location queries
- **Interactive Map:** Leaflet integration for visual event discovery
- **RESTful API:** Clean API architecture for frontend-backend communication
- **RSVP System:** Centralized attendance tracking
- **User Profiles:** Personalized event history and recommendations
- **Responsive Design:** Mobile-first approach for cross-device compatibility
- **Category System:** Structured categorization for easy filtering
- **Real-Time Updates:** Immediate UI updates after actions
- **No Account Required:** Demo user system for easy access

## 10. Advantages of Proposed System

1. **Unified Platform:** Single destination for event discovery
2. **Location-Based:** Find events near you with geospatial search
3. **Visual Discovery:** Interactive map for intuitive event exploration
4. **Easy RSVP:** Simple RSVP system with immediate feedback
5. **Personalized:** Recommendations based on user interests
6. **Mobile Friendly:** Responsive design for on-the-go access
7. **Real-Time:** Immediate updates and notifications
8. **Category Filtering:** Easy filtering by interest
9. **Social Features:** See which friends are attending
10. **Modern Technology:** Built with current web technologies and best practices

## 11. System Requirements

### Functional Requirements

FR1: The system shall allow users to browse events without authentication
FR2: The system shall display events on an interactive map
FR3: The system shall allow users to filter events by category
FR4: The system shall allow users to filter events by date range
FR5: The system shall allow users to filter events by price range
FR6: The system shall allow users to filter events by search query
FR7: The system shall allow users to filter events by location radius
FR8: The system shall allow users to create events
FR9: The system shall validate event creation inputs
FR10: The system shall allow users to RSVP to events
FR11: The system shall prevent duplicate RSVPs
FR12: The system shall allow users to cancel RSVPs
FR13: The system shall display user profiles
FR14: The system shall show user's RSVP history
FR15: The system shall provide event recommendations
FR16: The system shall handle geolocation requests
FR17: The system shall display event details
FR18: The system shall allow users to edit their own events
FR19: The system shall allow users to delete their own events
FR20: The system shall handle image loading errors gracefully

### Non-Functional Requirements

NFR1: The system shall load within 3 seconds on standard broadband
NFR2: The system shall be compatible with modern browsers (Chrome, Firefox, Safari, Edge)
NFR3: The system shall be responsive on desktop (1920px+), tablet (768px), and mobile (375px)
NFR4: The system shall handle at least 100 concurrent users
NFR5: The system shall provide 99% uptime availability
NFR6: The system shall protect against common web vulnerabilities (XSS, CSRF)
NFR7: The system shall implement proper CORS configuration
NFR8: The system shall sanitize user inputs
NFR9: The system shall provide meaningful error messages
NFR10: The system shall not expose sensitive information in error messages

## 12. Technology Stack

### Frontend
- **React 18.3** - UI library for building interactive interfaces
- **Vite 5.4** - Build tool and development server
- **JavaScript (ES6+)** - Programming language
- **Leaflet 1.9** - Open-source map library
- **React Leaflet 4.2** - React integration for Leaflet
- **CSS3** - Styling and responsive design

### Backend
- **Node.js** - JavaScript runtime environment
- **Express 4.21** - Web application framework
- **Mongoose 9.0** - MongoDB object modeling
- **CORS 2.8** - Cross-origin resource sharing
- **dotenv 16.4** - Environment variable management

### Database
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **2dsphere Index** - Geospatial indexing for location queries

### External Services
- **OpenStreetMap Nominatim** - Geocoding and address autocomplete
- **OpenStreetMap Tiles** - Map tile rendering

### Deployment
- **Render** - Cloud platform for frontend and backend deployment

## 13. System Architecture

LocalVibe follows a three-tier architecture:

**Presentation Layer (Frontend):**
- React-based user interface
- Interactive map with Leaflet
- Event cards and filters
- User profiles and RSVP controls

**Application Layer (Backend):**
- Express REST API
- Request validation and processing
- Business logic implementation
- External service integration

**Data Layer (Database):**
- MongoDB Atlas for data persistence
- Geospatial indexing for location queries
- User and event data models

The frontend communicates with the backend through RESTful API calls. The backend interacts with MongoDB Atlas using Mongoose ODM. External services (Nominatim, OpenStreetMap) are integrated through the backend to avoid CORS issues.

## 14. Module Description

### Frontend Modules

**App Module:**
- Main application component
- State management for events, users, filters
- Tab navigation (Discover, Create, Profile)
- RSVP handling and user selection

**EventList Module:**
- Event card rendering
- Image loading with fallback
- Event metadata display
- Selection handling

**EventMap Module:**
- Leaflet map integration
- Marker rendering and management
- Popup display with event details
- User location visualization

**EventForm Module:**
- Event creation/editing form
- Address autocomplete integration
- Form validation
- Success/error feedback

**Filters Module:**
- Filter controls (category, date, price, radius, search)
- Filter state management
- Clear filters functionality

**UserProfile Module:**
- User information display
- RSVP history (going, interested, organized)
- Recommendations display

**API Service Module:**
- Centralized API communication
- Error handling
- Request/response formatting

### Backend Modules

**Server Module:**
- Express server setup
- Middleware configuration
- Route mounting
- Error handling

**Database Module:**
- MongoDB connection management
- Connection retry logic
- DNS configuration

**Event Model Module:**
- Event schema definition
- Category validation
- Geospatial indexing
- Timestamps

**User Model Module:**
- User schema definition
- Email uniqueness
- Relationship management

**Events Route Module:**
- Event CRUD operations
- Filtering and search
- Geospatial queries
- Validation

**RSVP Route Module:**
- RSVP creation and cancellation
- Duplicate prevention
- User category tracking

**Users Route Module:**
- User CRUD operations
- User event retrieval
- Following functionality

**Geocode Route Module:**
- Address geocoding
- Nominatim API integration
- Timeout handling

**Seed Script Module:**
- Database initialization
- Test data creation
- Sample users and events

## 15. Database Design

### Event Collection Schema

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  startDate: Date (required),
  endDate: Date (required),
  location: {
    address: String (required),
    coordinates: {
      type: "Point",
      coordinates: [Number, Number] // [longitude, latitude]
    }
  },
  category: String (enum: Music, Food, Arts, Sports, Community, Nightlife, Markets, Technology, Other),
  price: Number (default: 0, min: 0),
  image: String,
  organizer: ObjectId (ref: User),
  isFeatured: Boolean (default: false),
  going: [ObjectId] (ref: User),
  interested: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### User Collection Schema

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique, lowercase),
  avatar: String,
  following: [ObjectId] (ref: User),
  attendedCategories: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

**Events Collection:**
- Primary index on `_id`
- 2dsphere index on `location.coordinates`
- Composite index on `startDate` and `category`

**Users Collection:**
- Primary index on `_id`
- Unique index on `email`

## 16. API Design

The API follows RESTful principles with resource-based URLs and HTTP methods.

### Endpoints

**Health:**
- `GET /api/health` - Service health check

**Events:**
- `GET /api/events` - List events with filters
- `GET /api/events/categories` - Get available categories
- `GET /api/events/nearby` - Geospatial nearby search
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

**RSVP:**
- `POST /api/events/:id/rsvp` - RSVP to event
- `GET /api/events/:id/friends-going` - Get friends attending

**Users:**
- `GET /api/users` - List users
- `GET /api/users/:id` - Get user
- `GET /api/users/:id/events` - Get user's events
- `POST /api/users/:id/follow/:targetId` - Follow user

**Geocoding:**
- `GET /api/geocode?q=` - Address geocoding

**Recommendations:**
- `GET /api/events/recommendations/:userId` - Get recommendations

## 17. Geospatial Implementation

### Coordinate System

LocalVibe uses GeoJSON Point format for storing coordinates:
- **Storage:** `[longitude, latitude]` (GeoJSON standard)
- **Display:** `[latitude, longitude]` (Leaflet standard)

### 2dsphere Index

MongoDB's 2dsphere index enables efficient geospatial queries:

```javascript
eventSchema.index({ 'location.coordinates': '2dsphere' });
```

### Nearby Search Algorithm

Events are found using MongoDB's `$near` operator:

```javascript
{
  'location.coordinates': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      $maxDistance: radiusKm * 1000
    }
  }
}
```

### Distance Calculation

The Haversine formula calculates great-circle distance between two points on Earth for display purposes.

## 18. Leaflet Map Integration

### Map Configuration

- Base layer: OpenStreetMap tiles
- Default center: New York City (40.7128, -74.006)
- Default zoom: 13
- Scroll wheel zoom: Enabled

### Marker System

- **Default markers:** Blue pins for regular events
- **Featured markers:** Gold pins for featured events
- **User location:** Cyan circle with white border

### Popup Content

Event popups display:
- Event title
- Address
- Date/time
- Category badge
- Price
- RSVP buttons (if user selected)

### Tile Error Handling

Graceful degradation when map tiles fail to load, showing an error message in the corner of the map.

## 19. Geolocation

### Browser Geolocation API

LocalVibe uses the browser's Geolocation API to detect user location.

### Permission Handling

- **Granted:** Location used for nearby filtering and map centering
- **Denied:** Error message shown, application continues with all events
- **Timeout:** Error message shown, application continues with all events
- **Unavailable:** Error message shown, application continues with all events

### Configuration

- Enable high accuracy: true
- Timeout: 10 seconds
- Maximum age: 5 minutes (for cached location)

## 20. Event Discovery

### Default Behavior

By default, LocalVibe shows all events without applying a radius filter. This ensures users see all available events regardless of their location.

### Filtering Options

Users can filter events by:
- **Category:** Music, Food, Arts, Sports, Community, Nightlife, Markets, Technology, Other
- **Date Range:** Start and end dates
- **Price Range:** Minimum and maximum price
- **Search:** Full-text search in title and description
- **Featured:** Show only featured events
- **Radius:** Distance from user location (km)

### Implementation

Filters are combined in API queries using MongoDB query operators. Multiple filters are applied with AND logic.

## 21. Filtering

### Category Filtering

Uses MongoDB's `$eq` operator for exact category matching. Backend normalizes category names case-insensitively.

### Date Filtering

- **Start date:** Events on or after the specified date
- **End date:** Events on or before the specified date (includes entire day)

### Price Filtering

- **Minimum price:** Events with price >= minPrice
- **Maximum price:** Events with price <= maxPrice

### Radius Filtering

Uses MongoDB's `$near` geospatial operator with `$maxDistance` for radius-based filtering.

### Search Filtering

Uses MongoDB's `$regex` operator for case-insensitive search in title and description fields.

## 22. Event Creation

### Form Fields

- **Title** (required): Event name
- **Description** (optional): Event details
- **Start Date/Time** (required): When event starts
- **End Date/Time** (required): When event ends
- **Address** (required): Event location
- **Coordinates** (required): Auto-populated from address selection
- **Category** (required): Event category
- **Price** (optional): Event cost (default: 0)
- **Image URL** (optional): Event image
- **Featured** (optional): Featured event flag

### Validation

- End date must be after start date
- Coordinates must be valid (latitude: -90 to 90, longitude: -180 to 180)
- Category must be one of the supported categories
- Required fields must be present

### Address Autocomplete

Integrated with Nominatim API for address suggestions. User selects from suggestions to auto-populate coordinates.

## 23. RSVP System

### RSVP States

- **Going:** User plans to attend the event
- **Interested:** User is interested but not committed
- **None:** User has cancelled RSVP

### Implementation

1. User clicks RSVP button
2. Frontend shows loading state
3. API request sent to backend
4. Backend removes user from both `going` and `interested` arrays
5. Backend adds user to the requested array
6. If status is "going", event category added to user's `attendedCategories`
7. MongoDB updates event and user documents
8. Updated event returned to frontend
9. Frontend updates UI immediately
10. Success message displayed

### Duplicate Prevention

The backend ensures a user cannot be in both `going` and `interested` arrays simultaneously by removing the user from both arrays before adding to the requested array.

## 24. User Profiles

### Profile Information

- **Name:** User's full name
- **Email:** User's email address
- **Avatar:** Profile picture URL
- **Following:** Users this user follows
- **Attended Categories:** Categories of events user has attended

### Event History

- **Going:** Events user is going to
- **Interested:** Events user is interested in
- **Organized:** Events user has created

### Recommendations

Based on user's `attendedCategories`, the system recommends:
- Events in categories the user has previously attended
- Filtered by geospatial proximity to user's location
- Limited to 12 results
- Excludes events user is already going to

## 25. Security

### Implemented Security Measures

**CORS Configuration:**
- Origin validation based on `FRONTEND_URL` environment variable
- Development origins allowed during development
- Credentials mode enabled
- OPTIONS/preflight handling

**Security Headers:**
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security: max-age=31536000

**Input Validation:**
- ObjectId format validation
- Latitude range validation (-90 to 90)
- Longitude range validation (-180 to 180)
- Radius validation (positive numbers)
- Date range validation
- Category enum validation
- Price minimum validation (0)

**Error Handling:**
- Generic error messages for internal errors
- No stack traces exposed to clients
- Specific validation errors for bad requests
- Graceful degradation for external service failures

**Data Privacy:**
- Email addresses excluded from public event responses
- MongoDB credentials stored in environment variables only
- .env files excluded from Git

**Current Limitations:**
- No authentication/authorization implemented
- No rate limiting
- No request signing
- This is suitable for demonstration/MVP purposes

## 26. Testing

### Code Verification

The following features were verified through code inspection:

- All API endpoints correctly implemented
- Validation logic in place for all inputs
- RSVP duplicate prevention implemented
- Category normalization implemented
- Geospatial queries correctly structured
- CORS configuration appropriate
- Security headers configured
- Error handling comprehensive
- Responsive design CSS implemented

### Production Testing

The following were verified against the production deployment:

- Backend health endpoint returns 200
- Backend events endpoint returns data
- Backend categories endpoint returns 9 categories
- MongoDB Atlas connection successful
- Frontend loads successfully
- Frontend communicates with backend without CORS errors

### Local Development Testing

- Frontend production build successful
- Local MongoDB connection requires credential update (external issue)

## 27. Results

LocalVibe successfully implements all planned features:

- ✅ Event discovery with multiple filters
- ✅ Interactive map with Leaflet
- ✅ Geolocation support
- ✅ Event creation with address autocomplete
- ✅ RSVP system with duplicate prevention
- ✅ User profiles with recommendations
- ✅ Responsive design for all devices
- ✅ RESTful API with proper validation
- ✅ MongoDB geospatial queries
- ✅ Security measures implemented
- ✅ Production deployment operational

The application provides a functional, user-friendly platform for local event discovery suitable for demonstration and MVP use.

## 28. Limitations

### Current Limitations

1. **Authentication:** No user authentication implemented
2. **Authorization:** No role-based access control
3. **Rate Limiting:** No API rate limiting
4. **Pagination:** No pagination for large result sets
5. **Real-Time Updates:** No WebSocket for real-time updates
6. **Push Notifications:** No notification system
7. **Image Upload:** No direct image upload (uses external URLs)
8. **Social Login:** No OAuth integration
9. **Advanced Search:** No full-text search index
10. **Analytics:** No usage analytics or event tracking

### External Dependencies

1. **Nominatim API:** Availability depends on external service
2. **OpenStreetMap Tiles:** Tile loading depends on external CDN
3. **MongoDB Atlas:** Cloud database availability not guaranteed

### Scalability

1. **Concurrent Users:** Not tested under high load
2. **Database Performance:** No query optimization for large datasets
3. **Caching:** No caching layer implemented

## 29. Future Scope

### Planned Enhancements

1. **Authentication System:** Implement JWT-based authentication
2. **User Registration:** Allow users to create accounts
3. **Email Verification:** Verify user email addresses
4. **Password Reset:** Implement password recovery
5. **Role-Based Authorization:** Admin, organizer, user roles
6. **Image Upload:** Direct image upload to cloud storage
7. **Social Login:** OAuth integration (Google, Facebook)
8. **Real-Time Updates:** WebSocket integration for live updates
9. **Push Notifications:** Browser push notifications for event reminders
10. **Advanced Search:** Full-text search with Elasticsearch
11. **Recommendation Engine:** Machine learning-based recommendations
12. **Event Analytics:** Dashboard for organizers to track event performance
13. **Calendar Integration:** Export events to calendar apps
14. **Social Sharing:** Share events on social media
15. **Reviews and Ratings:** Allow users to review events
16. **Ticketing:** Integrated ticket booking system
17. **Multi-Language Support:** Internationalization (i18n)
18. **Dark Mode:** Theme toggle for user preference
19. **Offline Support:** Progressive Web App (PWA) with offline capability
20. **Performance Optimization:** Implement caching and CDN

## 30. Conclusion

LocalVibe successfully addresses the problem of local event discovery by providing a unified, map-based platform with geospatial search capabilities. The application demonstrates the effective use of modern web technologies including React, Express, MongoDB, and Leaflet to create a functional and user-friendly event discovery system.

The project achieves its primary objectives of enabling users to discover, create, and interact with local events through an intuitive interface. The implementation of geospatial queries, interactive mapping, and RSVP functionality provides a solid foundation for a production-ready event discovery platform.

While the current version is suitable for demonstration and MVP purposes, future enhancements including authentication, advanced recommendations, and real-time features would be necessary for a full production deployment. The modular architecture and clean codebase provide a strong foundation for these future developments.

LocalVibe serves as a practical example of full-stack web development, database design, API architecture, and geospatial application development, making it suitable for academic submission and internship evaluation.

## 31. References

1. React Documentation: https://react.dev
2. Express Documentation: https://expressjs.com
3. MongoDB Documentation: https://docs.mongodb.com
4. Mongoose Documentation: https://mongoosejs.com
5. Leaflet Documentation: https://leafletjs.com
6. OpenStreetMap: https://www.openstreetmap.org
7. Nominatim API: https://nominatim.openstreetmap.org
8. Render Documentation: https://render.com/docs
9. MongoDB Atlas: https://www.mongodb.com/cloud/atlas
10. GeoJSON Specification: https://geojson.org
