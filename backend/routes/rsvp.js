import express from 'express';
import mongoose from 'mongoose';
import Event from '../models/Event.js';
import User from '../models/User.js';

const router = express.Router();

function validateObjectId(req, res, next) {
  const { eventId } = req.params;
  if (!mongoose.isValidObjectId(eventId)) {
    return res.status(400).json({ error: 'Invalid event id' });
  }
  next();
}

router.post('/:eventId/rsvp', validateObjectId, async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!userId || !mongoose.isValidObjectId(String(userId))) {
      return res.status(400).json({ error: 'A valid userId is required' });
    }

    if (!['going', 'interested', 'none'].includes(status)) {
      return res.status(400).json({ error: 'Valid status (going|interested|none) required' });
    }

    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Remove user from both arrays first
    event.going = event.going.filter((id) => id.toString() !== userId);
    event.interested = event.interested.filter((id) => id.toString() !== userId);

    if (status === 'going') {
      event.going.push(userId);

      const user = await User.findById(userId);
      if (user && !user.attendedCategories.includes(event.category)) {
        user.attendedCategories.push(event.category);
        await user.save();
      }
    } else if (status === 'interested') {
      event.interested.push(userId);
    }

    await event.save();

    const populated = await Event.findById(event._id)
      .populate('going', 'name avatar')
      .populate('interested', 'name avatar')
      .lean();

    res.json(populated);
  } catch (err) {
    console.error('POST /:eventId/rsvp error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:eventId/friends-going', validateObjectId, async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || !mongoose.isValidObjectId(String(userId))) {
      return res.status(400).json({ error: 'A valid userId query param is required' });
    }

    const user = await User.findById(userId).populate('following', 'name avatar');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const event = await Event.findById(req.params.eventId).populate('going', 'name avatar');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const followingIds = new Set(user.following.map((f) => f._id.toString()));
    const friendsGoing = event.going.filter((g) => followingIds.has(g._id.toString()));

    res.json({
      count: friendsGoing.length,
      friends: friendsGoing,
      message:
        friendsGoing.length > 0
          ? `${friendsGoing.length} friend${friendsGoing.length > 1 ? 's are' : ' is'} going`
          : null,
    });
  } catch (err) {
    console.error('GET /:eventId/friends-going error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
