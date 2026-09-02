import express from 'express';
import mongoose from 'mongoose';
import Event, { CATEGORIES, normalizeCategory } from '../models/Event.js';
import User from '../models/User.js';

const router = express.Router();

function parseNumber(value) {
  if (typeof value === 'string' && value.trim() === '') {
    return Number.NaN;
  }

  return Number(value);
}

function validateCoordinates(lat, lng) {
  const latitude = parseNumber(lat);
  const longitude = parseNumber(lng);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { error: 'Latitude and longitude must be valid numbers' };
  }
  if (latitude < -90 || latitude > 90) {
    return { error: 'Latitude must be between -90 and 90' };
  }
  if (longitude < -180 || longitude > 180) {
    return { error: 'Longitude must be between -180 and 180' };
  }

  return { latitude, longitude };
}

function validateRadius(radius) {
  const radiusKm = parseNumber(radius);

  if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
    return { error: 'radius must be a positive number (kilometers)' };
  }

  return { radiusKm };
}

function parseEndDateFilter(value) {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T23:59:59.999Z`);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return parseDate(value);
}

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function buildEventQuery(filters = {}) {
  const query = {};

  if (filters.category) {
    const normalized = normalizeCategory(filters.category);
    query.category = normalized || filters.category;
  }

  if (filters.q && String(filters.q).trim()) {
    const keyword = String(filters.q).trim();
    query.$or = [
      { title: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (filters.startDate) {
    const startDate = parseDate(filters.startDate);
    if (!startDate) {
      return { error: 'Invalid startDate' };
    }
    query.startDate = { ...(query.startDate || {}), $gte: startDate };
  }
  if (filters.endDate) {
    const endDate = parseEndDateFilter(filters.endDate);
    if (!endDate) {
      return { error: 'Invalid endDate' };
    }
    query.endDate = { ...(query.endDate || {}), $lte: endDate };
  }

  if (filters.price !== undefined && filters.price !== '') {
    const price = Number(filters.price);
    if (!Number.isNaN(price)) {
      query.price = price;
    }
  }

  if (filters.minPrice !== undefined && filters.minPrice !== '') {
    const minPrice = Number(filters.minPrice);
    if (!Number.isNaN(minPrice)) {
      query.price = { ...(query.price || {}), $gte: minPrice };
    }
  }

  if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
    const maxPrice = Number(filters.maxPrice);
    if (!Number.isNaN(maxPrice)) {
      query.price = { ...(query.price || {}), $lte: maxPrice };
    }
  }

  if (filters.featured === 'true') {
    query.isFeatured = true;
  } else if (filters.featured === 'false') {
    query.isFeatured = false;
  }

  return query;
}

function validateEventId(req, res, next) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid event id' });
  }
  next();
}

router.get('/categories', (_req, res) => {
  res.json(CATEGORIES);
});

router.get('/nearby', async (req, res) => {
  try {
    const coordinates = validateCoordinates(req.query.lat, req.query.lng);
    if (coordinates.error) {
      return res.status(400).json({ error: coordinates.error });
    }

    const radius = validateRadius(req.query.radius ?? 5);
    if (radius.error) {
      return res.status(400).json({ error: radius.error });
    }

    const { latitude, longitude } = coordinates;
    const { radiusKm } = radius;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);

    const filters = buildEventQuery(req.query);
    if (filters.error) {
      return res.status(400).json({ error: filters.error });
    }
    const events = await Event.find({
      ...filters,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusKm * 1000,
        },
      },
    })
      .populate('organizer', 'name avatar _id')
      .populate('going', 'name avatar')
      .populate('interested', 'name avatar')
      .limit(limit)
      .lean();

    res.json(events);
  } catch (err) {
    console.error('GET /nearby error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/recommendations/:userId', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radiusKm = parseFloat(req.query.radius) || 10;

    const categories =
      user.attendedCategories.length > 0
        ? user.attendedCategories
        : ['Music', 'Food', 'Community'];

    const query = {
      category: { $in: categories },
      startDate: { $gte: new Date() },
    };

    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      query['location.coordinates'] = {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: radiusKm * 1000,
        },
      };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name avatar _id')
      .limit(12)
      .lean();

    res.json({
      reason: `Because you enjoy ${categories.slice(0, 2).join(' & ')} events`,
      events,
    });
  } catch (err) {
    console.error('GET /recommendations/:userId error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const filters = buildEventQuery(req.query);
    if (filters.error) {
      return res.status(400).json({ error: filters.error });
    }
    if (!filters.startDate) {
      filters.startDate = { $gte: new Date() };
    }

    const events = await Event.find(filters)
      .populate('organizer', 'name avatar _id')
      .populate('going', 'name avatar')
      .populate('interested', 'name avatar')
      .sort({ startDate: 1 })
      .limit(100)
      .lean();

    res.json(events);
  } catch (err) {
    console.error('GET / (list events) error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', validateEventId, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name avatar _id')
      .populate('going', 'name avatar')
      .populate('interested', 'name avatar')
      .lean();

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error('GET /:id (get event) error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      address,
      lat,
      lng,
      category,
      price,
      image,
      organizerId,
      isFeatured,
    } = req.body;

    if (!title || !startDate || !endDate || !address || lat == null || lng == null || !category || !organizerId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!mongoose.isValidObjectId(String(organizerId))) {
      return res.status(400).json({ error: 'Invalid organizer id' });
    }

    const normalizedCategory = normalizeCategory(category);
    if (!normalizedCategory) {
      return res.status(400).json({ error: `Invalid category. Allowed values: ${CATEGORIES.join(', ')}` });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date provided' });
    }
    if (end <= start) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const coordinates = validateCoordinates(lat, lng);
    if (coordinates.error) {
      return res.status(400).json({ error: coordinates.error });
    }
    const { latitude, longitude } = coordinates;

    const finalPrice = Number(price ?? 0);
    if (Number.isNaN(finalPrice) || finalPrice < 0) {
      return res.status(400).json({ error: 'Price must be a non-negative number' });
    }

    const event = await Event.create({
      title: String(title).trim(),
      description: String(description || '').trim(),
      startDate,
      endDate,
      location: {
        address: String(address).trim(),
        coordinates: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      },
      category: normalizedCategory,
      price: finalPrice,
      image: String(image || '').trim(),
      organizer: organizerId,
      isFeatured: Boolean(isFeatured),
    });

    const populated = await Event.findById(event._id)
      .populate('organizer', 'name avatar _id')
      .lean();

    res.status(201).json(populated);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }
    console.error('POST / (create event) error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', validateEventId, async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.category) {
      const normalized = normalizeCategory(updates.category);
      if (!normalized) {
        return res.status(400).json({ error: `Invalid category. Allowed values: ${CATEGORIES.join(', ')}` });
      }
      updates.category = normalized;
    }

    const hasLocationField =
      updates.address !== undefined || updates.lat != null || updates.lng != null;
    if (hasLocationField) {
      if (!updates.address || updates.lat == null || updates.lng == null) {
        return res.status(400).json({
          error: 'address, lat, and lng must be supplied together when updating a location',
        });
      }

      const coordinates = validateCoordinates(updates.lat, updates.lng);
      if (coordinates.error) {
        return res.status(400).json({ error: coordinates.error });
      }
      const { latitude, longitude } = coordinates;

      updates.location = {
        address: String(updates.address).trim(),
        coordinates: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
      };
      delete updates.lat;
      delete updates.lng;
      delete updates.address;
    }

    if (updates.price !== undefined && updates.price !== null) {
      const price = Number(updates.price);
      if (Number.isNaN(price) || price < 0) {
        return res.status(400).json({ error: 'Price must be a non-negative number' });
      }
      updates.price = price;
    }

    const hasStartDate = updates.startDate !== undefined;
    const hasEndDate = updates.endDate !== undefined;
    const start = hasStartDate ? parseDate(updates.startDate) : null;
    const end = hasEndDate ? parseDate(updates.endDate) : null;

    if (hasStartDate && !start) {
        return res.status(400).json({ error: 'Invalid start date' });
    }
    if (hasEndDate && !end) {
      return res.status(400).json({ error: 'Invalid end date' });
    }

    const existingEvent = await Event.findById(req.params.id).select('startDate endDate').lean();
    if (!existingEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const effectiveStartDate = start || existingEvent.startDate;
    const effectiveEndDate = end || existingEvent.endDate;
    if (effectiveEndDate <= effectiveStartDate) {
      return res.status(400).json({ error: 'End date must be after start date' });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate('organizer', 'name email avatar')
      .lean();

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (err) {
    console.error('PUT /:id (update event) error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', validateEventId, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('DELETE /:id (delete event) error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
