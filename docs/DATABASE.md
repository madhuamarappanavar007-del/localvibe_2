# LocalVibe Database Documentation

## Overview

LocalVibe uses MongoDB Atlas as its primary database. MongoDB is a NoSQL document database that provides flexibility for storing event data with geospatial capabilities.

## Database Name

**localvibe**

## Collections

### events

Stores all event information including location, RSVP data, and organizer details.

#### Event Schema

```javascript
{
  _id: ObjectId,                    // Auto-generated unique identifier
  title: String,                    // Event title (required)
  description: String,              // Event description
  startDate: Date,                  // Event start date/time (required)
  endDate: Date,                    // Event end date/time (required)
  location: {
    address: String,                // Human-readable address (required)
    coordinates: {
      type: String,                 // Always "Point"
      coordinates: [Number, Number] // [longitude, latitude] (required)
    }
  },
  category: String,                // Event category (required, enum)
  price: Number,                    // Event price (default: 0, min: 0)
  image: String,                    // Event image URL
  organizer: ObjectId,              // Reference to User who created event (required)
  isFeatured: Boolean,             // Featured event flag (default: false)
  going: [ObjectId],               // Array of User IDs marked as "going"
  interested: [ObjectId],           // Array of User IDs marked as "interested"
  createdAt: Date,                  // Auto-generated timestamp
  updatedAt: Date,                  // Auto-generated timestamp
  __v: Number                       // Mongoose version key
}
```

#### Event Categories

The following categories are supported (enum):

1. **Music** - Musical events, concerts, performances
2. **Food** - Food festivals, cooking classes, food markets
3. **Arts** - Art exhibitions, galleries, creative workshops
4. **Sports** - Sports events, tournaments, fitness activities
5. **Community** - Community gatherings, meetups, social events
6. **Nightlife** - Nightclubs, parties, evening entertainment
7. **Markets** - Farmers markets, craft fairs, shopping events
8. **Technology** - Tech meetups, hackathons, conferences
9. **Other** - Events that don't fit other categories

#### Category Normalization

The backend uses a `normalizeCategory()` function to ensure case-insensitive category matching:

```javascript
function normalizeCategory(value) {
  const cleaned = value.trim();
  const match = CATEGORIES.find(
    (category) => category.toLowerCase() === cleaned.toLowerCase()
  );
  return match || null;
}
```

This ensures that "technology", "Technology", and "TECHNOLOGY" all map to the same category.

#### Geospatial Data Structure

Events use GeoJSON Point format for location data:

```javascript
{
  type: "Point",
  coordinates: [longitude, latitude]
}
```

**Important:** GeoJSON uses `[longitude, latitude]` order, which is different from Leaflet's `[latitude, longitude]` display order.

#### 2dsphere Index

The events collection has a geospatial index for efficient location-based queries:

```javascript
eventSchema.index({ 'location.coordinates': '2dsphere' });
```

This enables:
- `$near` queries for finding nearby events
- Distance calculations
- Radius-based filtering

#### Composite Index

A composite index on `startDate` and `category` for efficient date+category filtering:

```javascript
eventSchema.index({ startDate: 1, category: 1 });
```

#### Example Event Document

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
  "organizer": ObjectId("6a9181d03c9bd22816091459"),
  "isFeatured": false,
  "going": [
    ObjectId("6a9181d03c9bd22816091456"),
    ObjectId("6a9181d03c9bd22816091457")
  ],
  "interested": [
    ObjectId("6a9181d03c9bd22816091459")
  ],
  "createdAt": "2026-08-28T12:40:49.736Z",
  "updatedAt": "2026-08-28T12:40:49.736Z",
  "__v": 0
}
```

### users

Stores user information including profile data and social connections.

#### User Schema

```javascript
{
  _id: ObjectId,                    // Auto-generated unique identifier
  name: String,                     // User's full name (required)
  email: String,                    // User's email (required, unique, lowercase)
  avatar: String,                   // Profile picture URL
  following: [ObjectId],            // Array of User IDs this user follows
  attendedCategories: [String],     // Categories of events user has attended
  createdAt: Date,                  // Auto-generated timestamp
  updatedAt: Date,                  // Auto-generated timestamp
  __v: Number                       // Mongoose version key
}
```

#### User Relationships

**Following:** Social connections to other users. Used for "friends going" feature.

**Attended Categories:** Automatically populated when a user RSVPs "going" to an event. Used for personalized recommendations.

#### Example User Document

```json
{
  "_id": "6a9181d03c9bd22816091456",
  "name": "Alex Rivera",
  "email": "alex@localvibe.test",
  "avatar": "https://i.pravatar.cc/150?u=alex",
  "following": [
    ObjectId("6a9181d03c9bd22816091457"),
    ObjectId("6a9181d03c9bd22816091458")
  ],
  "attendedCategories": [
    "Music",
    "Community",
    "Arts"
  ],
  "createdAt": "2026-08-28T12:40:49.000Z",
  "updatedAt": "2026-08-28T12:40:49.000Z",
  "__v": 0
}
```

## Geospatial Queries

### Nearby Events Query

Find events within a specified radius of a location:

```javascript
db.events.find({
  'location.coordinates': {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      $maxDistance: radiusKm * 1000  // Convert km to meters
    }
  }
})
```

### Distance Calculation

The Haversine formula is used in the frontend to calculate display distances. MongoDB's `$near` uses spherical geometry for accurate calculations.

## Data Relationships

### Event → Organizer

Each event has an `organizer` field that references a User document.

```javascript
organizer: ObjectId("6a9181d03c9bd22816091459")
```

This is populated using Mongoose's `.populate()` method:

```javascript
.populate('organizer', 'name avatar')
```

**Security Note:** The email field is excluded from public organizer responses to protect user privacy.

### Event → RSVP Users

Events have two arrays that reference User documents:

- `going` - Users marked as "going"
- `interested` - Users marked as "interested"

These are populated when fetching event details:

```javascript
.populate('going interested', 'name avatar')
```

### User → Following

Users have a `following` array that references other User documents.

```javascript
following: [ObjectId("..."), ObjectId("...")]
```

### User → Attended Categories

Users have an `attendedCategories` array that stores category strings.

This is automatically updated when a user RSVPs "going" to an event:

```javascript
user.attendedCategories.push(event.category);
```

## Query Patterns

### Event Discovery

```javascript
// Basic event list
db.events.find({}).sort({ startDate: 1 })

// With category filter
db.events.find({ category: 'Music' }).sort({ startDate: 1 })

// With date range
db.events.find({
  startDate: { $gte: ISODate('2026-09-01') },
  endDate: { $lte: ISODate('2026-09-30') }
}).sort({ startDate: 1 })

// With featured filter
db.events.find({ isFeatured: true }).sort({ startDate: 1 })

// With price range
db.events.find({
  price: { $gte: 0, $lte: 50 }
}).sort({ startDate: 1 })
```

### RSVP Operations

```javascript
// Add user to going
db.events.updateOne(
  { _id: eventId },
  {
    $pull: { going: userId, interested: userId },
    $push: { going: userId }
  }
)

// Add user to interested
db.events.updateOne(
  { _id: eventId },
  {
    $pull: { going: userId, interested: userId },
    $push: { interested: userId }
  }
)

// Cancel RSVP
db.events.updateOne(
  { _id: eventId },
  {
    $pull: { going: userId, interested: userId }
  }
)
```

### User Event Queries

```javascript
// Get events user is going to
db.events.find({ going: userId })

// Get events user is interested in
db.events.find({ interested: userId })

// Get events user organized
db.events.find({ organizer: userId })
```

## Indexes Summary

### Events Collection

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| Primary | `_id` | Default | Unique document identifier |
| Geospatial | `location.coordinates` | 2dsphere | Nearby event queries |
| Composite | `startDate, category` | Compound | Date+category filtering |

### Users Collection

| Index | Fields | Type | Purpose |
|-------|--------|------|---------|
| Primary | `_id` | Default | Unique document identifier |
| Unique | `email` | Unique | Email uniqueness constraint |

## Data Seeding

The `backend/scripts/seed.js` script creates initial test data:

- 5 users with diverse profiles
- 19 events across multiple cities (New York, London, Bengaluru, Hyderabad, San Francisco)
- Events in all supported categories
- Sample RSVP relationships
- User following relationships

**Important:** The seed script may delete existing data. Run with caution in production.

## Connection Configuration

### MongoDB Connection String

```
mongodb+srv://<username>:<password>@cluster0.pvldsaj.mongodb.net/localvibe?retryWrites=true&w=majority
```

### Connection Options

```javascript
{
  family: 4,                      // Force IPv4
  serverSelectionTimeoutMS: 15000, // Server selection timeout
  connectTimeoutMS: 15000,        // Connection timeout
  socketTimeoutMS: 60000,          // Socket timeout
  maxPoolSize: 10,                // Maximum connection pool size
  minPoolSize: 2,                 // Minimum connection pool size
  retryWrites: true,               // Retry write operations
  retryReads: true                 // Retry read operations
}
```

## Data Validation

### Mongoose Validation

**Event Schema Validation:**
- `title` - Required, trimmed
- `startDate` - Required, must be a valid Date
- `endDate` - Required, must be after startDate
- `location.address` - Required
- `location.coordinates` - Required, must be valid numbers
- `category` - Required, must be one of the enum values
- `price` - Minimum 0

**User Schema Validation:**
- `name` - Required, trimmed
- `email` - Required, unique, lowercase, trimmed

### Backend Validation

Additional validation in route handlers:
- ObjectId format validation
- Latitude range (-90 to 90)
- Longitude range (-180 to 180)
- Radius validation (positive number)
- Date range consistency for updates

## Backup and Recovery

### MongoDB Atlas Backups

MongoDB Atlas provides automated backups:
- Daily snapshots
- Point-in-time recovery
- Continuous cloud backup

### Export/Import

```bash
# Export collection
mongodump --uri "mongodb+srv://..." --db localvibe --collection events

# Import collection
mongorestore --uri "mongodb+srv://..." --db localvibe --collection events
```

## Performance Considerations

### Query Optimization

1. **Use indexes** - All filtering fields should be indexed
2. **Limit results** - Use `.limit()` for large result sets
3. **Project fields** - Use `.select()` to return only needed fields
4. **Avoid large documents** - Keep document size reasonable

### Geospatial Performance

- 2dsphere index is essential for geospatial queries
- Nearby queries are efficient with proper indexing
- Complex geospatial operations may be slower

### Connection Pooling

- Max pool size: 10 connections
- Min pool size: 2 connections
- Appropriate for typical web application load

## Security Considerations

### Data Protection

- Email addresses are not exposed in public event responses
- User PII is minimized in public API responses
- MongoDB credentials stored in environment variables only

### Access Control

- MongoDB Atlas IP whitelist
- Database user with appropriate permissions
- No direct database access from frontend

### Validation

- All inputs validated before database operations
- ObjectId validation prevents injection attacks
- Category enum prevents invalid categories

## Monitoring

### MongoDB Atlas Metrics

- Connection count
- Operation count
- Query performance
- Storage usage
- Index performance

### Logging

The backend logs:
- Connection attempts
- Query errors
- Validation failures
- Slow queries (if configured)

## Troubleshooting

### Common Issues

**Connection Timeout:**
- Check IP whitelist in MongoDB Atlas
- Verify network connectivity
- Check firewall settings

**Slow Queries:**
- Review query execution plan
- Add missing indexes
- Optimize query structure

**Duplicate Data:**
- Check unique constraints
- Review application logic
- Add additional validation if needed

## Future Enhancements

Potential database improvements:
- Add caching layer (Redis)
- Implement database sharding for large scale
- Add full-text search index
- Implement database read replicas
- Add change streams for real-time updates
