import mongoose from 'mongoose';

export default mongoose.model('User', {
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: [true, 'Username is already taken'],
    minlength: [8, 'Username must be at least 8 characters'],
    maxlength: [16, 'Username must be at most 16 characters'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
});
