import crypto from 'crypto';

import Vantage from 'vantage';
import JWT from 'jsonwebtoken';

import config from './config';
import logger from './logger';

export default function () {
  const vantageServer = new Vantage();

  // Create a new session
  vantageServer
    .command('session_new <permissions...>')
    .description('Creates a new session with supplied permissions')
    .action(function (args, callback) {
      // Create a new user id
      const userId = crypto.randomBytes(8).toString('hex');

      // Sign the user with jwt
      const userToken = JWT.sign({
        id: userId,
        permissions: args.permissions,
      }, config.jwtSecret);

      this.log(`Created new session with permissions '${args.permissions}', token: ${userToken}`);

      callback();
    });


  vantageServer
    .delimiter('$')
    .listen(config.vantagePort, () => {
      logger.info(`Started vantage server at http://localhost:${config.vantagePort}`);
    });
}
