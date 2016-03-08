import crypto from 'crypto';

import level from 'level';
import JWT from 'jsonwebtoken';

import config from '../src/config';

// Create a new user id
const userId = crypto.randomBytes(8).toString('hex');

// Sign the user with jwt
const userToken = JWT.sign({
  id: userId,
}, config.jwtSecret);

// Add user token to the database
const db = level(config.sessionStorePath);
db.put(userId, true, (err) => {
  if (err) {
    throw err;
  }

  console.log(`User added to session store (id: ${userId} token:${userToken})`);
});

