import config from './config';

export default function (server) {
  // Setup the authentication
  server.auth.strategy('users', 'jwt', {
    key: config.jwtSecret,
    validateFunc(decoded, request, callback) {
      callback(null, true);
    },
    verifyOptions: {
      algorithms: [
        'HS256',
      ],
    },
  });
}
