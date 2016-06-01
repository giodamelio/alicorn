import mongoose from 'mongoose';

export default mongoose.model('Session', {
  user: Object,
  createdAt: {
    type: Date,
    required: true,
  },
  usedAt: {
    type: Date,
    required: true,
  },
});
