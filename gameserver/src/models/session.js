import mongoose from 'mongoose';

import { UserSchema } from './user';

export default mongoose.model('Session', {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});
