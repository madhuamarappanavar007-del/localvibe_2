import mongoose from 'mongoose';

const CATEGORIES = [
  'Music',
  'Food',
  'Arts',
  'Sports',
  'Community',
  'Nightlife',
  'Markets',
  'Technology',
  'Other',
];

function normalizeCategory(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const cleaned = value.trim();
  if (!cleaned) {
    return null;
  }

  const match = CATEGORIES.find(
    (category) => category.toLowerCase() === cleaned.toLowerCase()
  );

  return match || null;
}

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: {
      address: { type: String, required: true },
      coordinates: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: {
          type: [Number],
          required: true,
        },
      },
    },
    category: { type: String, enum: CATEGORIES, required: true },
    price: { type: Number, default: 0, min: 0 },
    image: { type: String, default: '' },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isFeatured: { type: Boolean, default: false },
    going: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    interested: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

eventSchema.index({ 'location.coordinates': '2dsphere' });
eventSchema.index({ startDate: 1, category: 1 });

export { CATEGORIES, normalizeCategory };
export default mongoose.model('Event', eventSchema);
