import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar: { type: String, default: '' },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    attendedCategories: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
