import level from 'level';

import config from './config';

const sessionStore = level(config.sessionStorePath);

export default function (server) {
  // Setup the authentication
  server.auth.strategy('users', 'jwt', {
    key: config.jwtSecret,
    validateFunc(decoded, request, callback) {
      if (!decoded.id) {
        callback(null, false);
      }

      // Check to see if the session exists
      sessionStore.get(decoded.id, (err) => {
        if (err) {
          if (err.type === 'NotFoundError') {
            callback(null, false);
          }

          callback(err, false);
        }

        callback(null, true);
      });
    },
    verifyOptions: {
      algorithms: [
        'HS256',
      ],
    },
  });
}
