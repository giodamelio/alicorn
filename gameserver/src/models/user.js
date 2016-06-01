import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

const User = new mongoose.Schema({
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
    minlength: [8, 'Password must be at least 8 characters'],
    maxlength: [128, 'Password must be at most 128 characters'],
  },
});

// Automaticly hash the password
User.pre('save', function (next) {
  const user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // Generate a salt
  return bcrypt.genSalt(12, (saltErr, salt) => {
    if (saltErr) {
      next(saltErr);
    } else {
      // Hash the password along with our new salt
      bcrypt.hash(user.password, salt, (hashErr, hash) => {
        if (hashErr) {
          next(hashErr);
        } else {
          // Override the cleartext password with the hashed one
          user.password = hash;
          next();
        }
      });
    }
  });
});

export default mongoose.model('User', User);
