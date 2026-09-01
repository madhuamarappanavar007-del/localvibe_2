# LocalVibe API Documentation

## Base URL

**Development:** `http://localhost:5000/api`
**Production:** `https://localvibe-backend-2026.onrender.com/api`

## Authentication

Current version does not implement authentication. All endpoints are publicly accessible.

**Note:** This is suitable for demonstration/MVP purposes. Production applications should implement authentication and authorization.

## Response Format

All responses are in JSON format.

**Success Response:**
```json
{
  "status": "ok"
}
```

**Error Response:**
```json
{
  "error": "Error message description"
}
```

## Endpoints

### Health Check

#### GET /api/health

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "service": "LocalVibe API"
}
```

**Status Codes:**
- `200` - API is healthy

---

### Events

#### GET /api/events

Get a list of events with optional filtering.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | No | Search in title and description |
| category | string | No | Filter by category (Music, Food, Arts, Sports, Community, Nightlife, Markets, Technology, Other) |
| startDate | string | No | Filter events on or after this date (ISO 8601) |
| endDate | string | No | Filter events on or before this date (ISO 8601) |
| featured | string | No | Filter featured events ("true" for featured only) |
| minPrice | number | No | Minimum price |
| maxPrice | number | No | Maximum price |

**Example Request:**
```
GET /api/events?category=Music&featured=true&minPrice=0&maxPrice=50
```

**Response:**
```json
[
  {
    "_id": "6a9181d13c9bd2281609145e",
    "title": "Community Yoga in the Square",
    "description": "Free outdoor yoga session for all levels.",
    "startDate": "2026-09-01T12:30:00.000Z",
    "endDate": "2026-09-01T13:30:00.000Z",
    "location": {
      "address": "Washington Square Park, New York, NY",
      "coordinates": {
        "type": "Point",
        "coordinates": [-73.9973, 40.7308]
      }
    },
    "category": "Community",
    "price": 0,
    "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    "organizer": {
      "_id": "6a9181d03c9bd22816091459",
      "name": "Taylor Kim",
      "avatar": "https://i.pravatar.cc/150?u=taylor"
    },
    "isFeatured": false,
    "going": [...],
    "interested": [...],
    "createdAt": "2026-08-28T12:40:49.736Z",
    "updatedAt": "2026-08-28T12:40:49.736Z"
  }
]
```

**Status Codes:**
- `200` - Events retrieved successfully
- `400` - Invalid query parameters
- `500` - Internal server error

---

#### GET /api/events/categories

Get all available event categories.

**Response:**
```json
[
  "Music",
  "Food",
  "Arts",
  "Sports",
  "Community",
  "Nightlife",
  "Markets",
  "Technology",
  "Other"
]
```

**Status Codes:**
- `200` - Categories retrieved successfully

---

#### GET /api/events/nearby

Get events near a specific location using geospatial query.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lat | number | Yes | Latitude (-90 to 90) |
| lng | number | Yes | Longitude (-180 to 180) |
| radius | number | No | Search radius in kilometers (default: 5) |
| category | string | No | Filter by category |
| startDate | string | No | Filter events on or after this date |
| endDate | string | No | Filter events on or before this date |
| featured | string | No | Filter featured events |

**Example Request:**
```
GET /api/events/nearby?lat=40.7128&lng=-74.006&radius=10&category=Music
```

**Response:**
```json
[
  {
    "_id": "6a9181d13c9bd2281609145e",
    "title": "Indie Band Showcase",
    "location": {
      "address": "The Independent, 628 Divisadero St, San Francisco, CA",
      "coordinates": {
        "type": "Point",
        "coordinates": [-122.4376, 37.7749]
      }
    },
    "category": "Music",
    ...
  }
]
```

**Status Codes:**
- `200` - Nearby events retrieved successfully
- `400` - Invalid coordinates or radius
- `500` - Internal server error

---

#### GET /api/events/:id

Get a single event by ID.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Event ObjectId |

**Example Request:**
```
GET /api/events/6a9181d13c9bd2281609145e
```

**Response:**
```json
{
  "_id": "6a9181d13c9bd2281609145e",
  "title": "Community Yoga in the Square",
  "description": "Free outdoor yoga session for all levels.",
  "startDate": "2026-09-01T12:30:00.000Z",
  "endDate": "2026-09-01T13:30:00.000Z",
  "location": {
    "address": "Washington Square Park, New York, NY",
    "coordinates": {
      "type": "Point",
      "coordinates": [-73.9973, 40.7308]
    }
  },
  "category": "Community",
  "price": 0,
  "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
  "organizer": {
    "_id": "6a9181d03c9bd22816091459",
    "name": "Taylor Kim",
    "avatar": "https://i.pravatar.cc/150?u=taylor"
  },
  "isFeatured": false,
  "going": [
    {
      "_id": "6a9181d03c9bd22816091456",
      "name": "Alex Rivera",
      "avatar": "https://i.pravatar.cc/150?u=alex"
    }
  ],
  "interested": [
    {
      "_id": "6a9181d03c9bd22816091459",
      "name": "Taylor Kim",
      "avatar": "https://i.pravatar.cc/150?u=taylor"
    }
  ],
  "createdAt": "2026-08-28T12:40:49.736Z",
  "updatedAt": "2026-08-28T12:40:49.736Z"
}
```

**Status Codes:**
- `200` - Event retrieved successfully
- `400` - Invalid ObjectId format
- `404` - Event not found
- `500` - Internal server error

---

#### POST /api/events

Create a new event.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | string | Yes | Event title |
| description | string | No | Event description |
| startDate | string | Yes | Start date (ISO 8601) |
| endDate | string | Yes | End date (ISO 8601) |
| address | string | Yes | Event address |
| lat | number | Yes | Latitude (-90 to 90) |
| lng | number | Yes | Longitude (-180 to 180) |
| category | string | Yes | Event category |
| price | number | No | Event price (default: 0) |
| image | string | No | Event image URL |
| isFeatured | boolean | No | Featured flag (default: false) |
| organizerId | string | Yes | Organizer user ObjectId |

**Example Request:**
```json
{
  "title": "Tech Meetup 2026",
  "description": "Annual technology conference",
  "startDate": "2026-09-15T09:00:00.000Z",
  "endDate": "2026-09-15T17:00:00.000Z",
  "address": "Convention Center, San Francisco, CA",
  "lat": 37.7749,
  "lng": -122.4194,
  "category": "Technology",
  "price": 50,
  "image": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
  "isFeatured": true,
  "organizerId": "6a9181d03c9bd22816091456"
}
```

**Response:**
```json
{
  "_id": "6a9181d13c9bd22816091470",
  "title": "Tech Meetup 2026",
  ...
}
```

**Status Codes:**
- `201` - Event created successfully
- `400` - Invalid request body or validation error
- `404` - Organizer not found
- `500` - Internal server error

**Validation Rules:**
- End date must be after start date
- Latitude must be between -90 and 90
- Longitude must be between -180 and 180
- Category must be one of the supported categories
- Price must be non-negative

---

#### PUT /api/events/:id

Update an existing event.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Event ObjectId |

**Request Body:**

Same as POST /api/events, but all fields are optional.

**Example Request:**
```json
{
  "title": "Updated Tech Meetup 2026",
  "price": 75
}
```

**Response:**
```json
{
  "_id": "6a9181d13c9bd22816091470",
  "title": "Updated Tech Meetup 2026",
  "price": 75,
  ...
}
```

**Status Codes:**
- `200` - Event updated successfully
- `400` - Invalid request body or validation error
- `404` - Event not found
- `500` - Internal server error

**Authorization Note:** Frontend only shows edit/delete buttons to event organizers, but backend does not enforce this restriction. Production applications should implement proper authorization.

---

#### DELETE /api/events/:id

Delete an event.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Event ObjectId |

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

**Status Codes:**
- `200` - Event deleted successfully
- `400` - Invalid ObjectId format
- `404` - Event not found
- `500` - Internal server error

**Authorization Note:** Frontend only shows edit/delete buttons to event organizers, but backend does not enforce this restriction. Production applications should implement proper authorization.

---

### RSVP

#### POST /api/events/:id/rsvp

RSVP to an event (going, interested, or cancel).

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Event ObjectId |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | Yes | User ObjectId |
| status | string | Yes | RSVP status: "going", "interested", or "none" |

**Example Request:**
```json
{
  "userId": "6a9181d03c9bd22816091456",
  "status": "going"
}
```

**Response:**
```json
{
  "_id": "6a9181d13c9bd2281609145e",
  "title": "Community Yoga in the Square",
  "going": [
    {
      "_id": "6a9181d03c9bd22816091456",
      "name": "Alex Rivera",
      "avatar": "https://i.pravatar.cc/150?u=alex"
    }
  ],
  "interested": [],
  ...
}
```

**Status Codes:**
- `200` - RSVP updated successfully
- `400` - Invalid ObjectId or status
- `404` - Event or user not found
- `500` - Internal server error

**Behavior:**
- The user is removed from both `going` and `interested` arrays before being added to the requested array
- If status is "none", the user is removed from both arrays
- When status is "going", the event's category is added to the user's `attendedCategories`

---

#### GET /api/events/:id/friends-going

Get information about which friends are going to an event.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | User ObjectId |

**Example Request:**
```
GET /api/events/6a9181d13c9bd2281609145e/friends-going?userId=6a9181d03c9bd22816091456
```

**Response:**
```json
{
  "count": 2,
  "message": "2 friends are going: Alex Rivera, Jordan Lee"
}
```

**Status Codes:**
- `200` - Friends information retrieved successfully
- `400` - Invalid ObjectId
- `404` - Event or user not found
- `500` - Internal server error

---

### Users

#### GET /api/users

Get all users.

**Response:**
```json
[
  {
    "_id": "6a9181d03c9bd22816091456",
    "name": "Alex Rivera",
    "email": "alex@localvibe.test",
    "avatar": "https://i.pravatar.cc/150?u=alex",
    "following": [
      {
        "_id": "6a9181d03c9bd22816091457",
        "name": "Jordan Lee"
      }
    ],
    "attendedCategories": ["Music", "Community"],
    "createdAt": "2026-08-28T12:40:49.000Z",
    "updatedAt": "2026-08-28T12:40:49.000Z"
  }
]
```

**Status Codes:**
- `200` - Users retrieved successfully
- `500` - Internal server error

---

#### GET /api/users/:id

Get a single user by ID.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | User ObjectId |

**Response:**
```json
{
  "_id": "6a9181d03c9bd22816091456",
  "name": "Alex Rivera",
  "email": "alex@localvibe.test",
  "avatar": "https://i.pravatar.cc/150?u=alex",
  "following": [...],
  "attendedCategories": [...],
  "createdAt": "2026-08-28T12:40:49.000Z",
  "updatedAt": "2026-08-28T12:40:49.000Z"
}
```

**Status Codes:**
- `200` - User retrieved successfully
- `400` - Invalid ObjectId format
- `404` - User not found
- `500` - Internal server error

---

#### GET /api/users/:id/events

Get events related to a user (organized, going, interested).

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | User ObjectId |

**Response:**
```json
{
  "organized": [...],
  "going": [...],
  "interested": [...]
}
```

**Status Codes:**
- `200` - User events retrieved successfully
- `400` - Invalid ObjectId format
- `404` - User not found
- `500` - Internal server error

---

#### POST /api/users/:id/follow/:targetId

Follow another user.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | User ObjectId (follower) |
| targetId | string | Yes | User ObjectId (to follow) |

**Response:**
```json
{
  "message": "User followed successfully"
}
```

**Status Codes:**
- `200` - User followed successfully
- `400` - Invalid ObjectId or duplicate follow
- `404` - User not found
- `500` - Internal server error

---

### Geocoding

#### GET /api/geocode

Geocode an address to get coordinates.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Address to geocode |

**Example Request:**
```
GET /api/geocode?q=San%20Francisco
```

**Response:**
```json
[
  {
    "address": "San Francisco, California, USA",
    "displayName": "San Francisco, California, United States",
    "lat": 37.7749,
    "lng": -122.4194
  }
]
```

**Status Codes:**
- `200` - Geocoding successful
- `400` - Missing query parameter
- `504` - Geocoding service timeout
- `500` - Internal server error

**Note:** This endpoint proxies requests to OpenStreetMap Nominatim API to avoid browser CORS issues. Requests have a 5-second timeout.

---

### Recommendations

#### GET /api/events/recommendations/:userId

Get personalized event recommendations for a user.

**URL Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | string | Yes | User ObjectId |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lat | number | Yes | User's latitude |
| lng | number | Yes | User's longitude |

**Example Request:**
```
GET /api/events/recommendations/6a9181d03c9bd22816091456?lat=37.7749&lng=-122.4194
```

**Response:**
```json
{
  "reason": "Based on your interest in Music and Community events",
  "events": [
    {
      "_id": "6a9181d13c9bd2281609145e",
      "title": "Indie Band Showcase",
      "category": "Music",
      ...
    }
  ]
}
```

**Status Codes:**
- `200` - Recommendations retrieved successfully
- `400` - Invalid ObjectId or coordinates
- `404` - User not found
- `500` - Internal server error

**Algorithm:**
- Finds events in categories the user has previously attended
- Filters by geospatial proximity to user's location
- Limits to 12 results
- Excludes events the user is already going to

---

## Error Handling

### Common Error Responses

**Invalid ObjectId:**
```json
{
  "error": "Invalid ObjectId format"
}
```

**Not Found:**
```json
{
  "error": "Resource not found"
}
```

**Validation Error:**
```json
{
  "error": "End date must be after start date"
}
```

**Internal Server Error:**
```json
{
  "error": "Internal server error"
}
```

### CORS Errors

If the origin is not allowed, the API returns a CORS error:
```
CORS origin not allowed
```

## Rate Limiting

Current version does not implement rate limiting. Production applications should implement rate limiting to prevent abuse.

## Pagination

Current version does not implement pagination. All events are returned in a single response. Production applications should implement pagination for large datasets.

## Versioning

Current API version: v1 (no version prefix in URL)

Future versions may include version prefixes (e.g., `/api/v2/events`).

## Testing

### Example cURL Commands

```bash
# Health check
curl http://localhost:5000/api/health

# Get events
curl http://localhost:5000/api/events

# Get nearby events
curl "http://localhost:5000/api/events/nearby?lat=40.7128&lng=-74.006&radius=10"

# Create event
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "startDate": "2026-09-15T09:00:00.000Z",
    "endDate": "2026-09-15T17:00:00.000Z",
    "address": "Test Location",
    "lat": 40.7128,
    "lng": -74.006,
    "category": "Music",
    "organizerId": "6a9181d03c9bd22816091456"
  }'

# RSVP
curl -X POST http://localhost:5000/api/events/6a9181d13c9bd2281609145e/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "6a9181d03c9bd22816091456",
    "status": "going"
  }'
```

## Security Considerations

### Current Limitations

- No authentication/authorization
- No rate limiting
- No request signing
- No input sanitization beyond basic validation

### Recommendations for Production

1. Implement JWT or session-based authentication
2. Add role-based authorization (organizer, admin)
3. Implement rate limiting
4. Add request validation middleware
5. Implement API key authentication for external access
6. Add request logging and monitoring
7. Implement API versioning
8. Add pagination to list endpoints
9. Implement caching for frequently accessed data
10. Add API documentation with Swagger/OpenAPI

## Browser Testing

The frontend can be tested at:
- **Development:** http://localhost:5173
- **Production:** https://localvibe-frontend-a2x1.onrender.com

The backend can be tested at:
- **Development:** http://localhost:5000
- **Production:** https://localvibe-backend-2026.onrender.com
