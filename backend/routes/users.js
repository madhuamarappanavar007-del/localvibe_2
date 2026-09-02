import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Event from '../models/Event.js';

const router = express.Router();

function validateObjectId(req, res, next) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid user id' });
  }
  next();
}

router.get('/', async (_req, res) => {
  try {
    const users = await User.find().select('-__v -email').lean();
    res.json(users);
  } catch (err) {
    console.error('GET / (list users) error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'name avatar _id')
      .select('-email')
      .lean();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('GET /:id (get user) error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() }).select('-email');
    if (existing) {
      return res.json(existing);
    }

    const user = await User.create({ name, email, avatar: avatar || '' });
    const userResponse = await User.findById(user._id).select('-email').lean();
    res.status(201).json(userResponse);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    console.error('POST / (create user) error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/:id/follow/:targetId', async (req, res) => {
  try {
    const { id, targetId } = req.params;
    
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    if (!mongoose.isValidObjectId(targetId)) {
      return res.status(400).json({ error: 'Invalid target user ID' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const targetUser = await User.findById(targetId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Target user not found' });
    }

    if (id === targetId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    if (!user.following.some((followId) => followId.toString() === targetId)) {
      user.following.push(targetId);
      await user.save();
    }

    const updated = await User.findById(user._id)
      .populate('following', 'name avatar _id')
      .select('-email')
      .lean();
    res.json(updated);
  } catch (err) {
    console.error('POST /:id/follow/:targetId error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id/events', validateObjectId, async (req, res) => {
  try {
    const userId = req.params.id;

    const [organized, going, interested] = await Promise.all([
      Event.find({ organizer: userId })
        .populate('organizer', 'name avatar _id')
        .sort({ startDate: 1 })
        .lean(),
      Event.find({ going: userId })
        .populate('organizer', 'name avatar _id')
        .sort({ startDate: 1 })
        .lean(),
      Event.find({ interested: userId })
        .populate('organizer', 'name avatar _id')
        .sort({ startDate: 1 })
        .lean(),
    ]);

    res.json({ organized, going, interested });
  } catch (err) {
    console.error('GET /:id/events error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
