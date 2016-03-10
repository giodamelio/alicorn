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

  // Remove a sesssion
  vantageServer
    .command('session_rm <userId>')
    .description('Removes a session')
    .action(function (args, callback) {
      // Add user id to session store
      redis.del(args.userId, (err) => {
        if (err) {
          this.log(err);
          return callback();
        }

        this.log(`Session deleted (id: ${args.userId})`);
        return callback();
      });
    });


  // List current sessions
  vantageServer
    .command('session_list')
    .description('Lists current sessions')
    .action(function (args, callback) {
      redis.keys('*', (err, result) => {
        if (err) {
          server.log('error', err);
          return callback();
        }

        this.log(result);
        return callback();
      });
    });

  // Count current sessions
  vantageServer
    .command('session_count')
    .description('Lists current session count')
    .action(function (args, callback) {
      redis.dbsize((err, result) => {
        if (err) {
          server.log('error', err);
          return callback();
        }

        this.log(result);
        return callback();
      });
    });

  vantageServer
    .delimiter('$')
    .listen(config.vantagePort, () => {
      server.log('info', `Started vantage server at http://localhost:${config.vantagePort}`);
    });
}
