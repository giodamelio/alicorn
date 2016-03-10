import Redis from 'ioredis';

import config from './config';

const redis = new Redis();

export default function (server) {
  // Setup the authentication
  server.auth.strategy('users', 'jwt', {
    key: config.jwtSecret,
    validateFunc(decoded, request, callback) {
      if (!decoded.id) {
        callback(null, false);
      }

      // Check to see if the session exists
      redis.get(decoded.id, (err, result) => {
        if (err) {
          server.log('error', result);
          callback(err, false);
        }

        if (result) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      });
    },
    verifyOptions: {
      algorithms: [
        'HS256',
      ],
    },
  });
}
