import crypto from 'crypto';

import Vantage from 'vantage';
import JWT from 'jsonwebtoken';
import Redis from 'ioredis';

import config from '../src/config';

export default function (server) {
  const vantageServer = new Vantage();
  const redis = new Redis();

  // Create a new session
  vantageServer
    .command('session_new')
    .description('Creates a new session')
    .action(function (args, callback) {
      this.log('Creating a new session');

      // Create a new user id
      const userId = crypto.randomBytes(8).toString('hex');

      // Sign the user with jwt
      const userToken = JWT.sign({
        id: userId,
      }, config.jwtSecret);

      // Add user id to session store
      redis.set(userId, 1, (err) => {
        if (err) {
          this.log(err);
          return callback();
        }

        this.log(`New session (id: ${userId}, token: ${userToken})`);
        return callback();
      });
    });

  vantageServer
    .delimiter('$')
    .listen(config.vantagePort, () => {
      server.log('info', `Started vantage server at http://localhost:${config.vantagePort}`);
    });
}
