import mongoose from 'mongoose';
import shortid from 'shortid';

const user = mongoose.model('User', {
  _id: {
    type: String,
    required: true,
    unique: true,
    default: () => shortid.generate(),
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
});

export default user;
