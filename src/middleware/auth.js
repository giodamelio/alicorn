import JWT from 'jsonwebtoken';
import Boom from 'boom';

import config from '../config';

export default function (permission) {
  return async (ctx, next) => {
    ctx.logger = ctx.logger.child({ type: 'auth' });
    ctx.logger.trace(`Checking auth for ${permission}`);

    const authHeader = ctx.request.header.authorization;

    if (authHeader) {
      // Validate format
      const parts = authHeader.split(' ');
      const token = parts[1];
      if (!(parts.length === 2 && parts[0] === 'Bearer')) {
        throw Boom.unauthorized('Invalid authorization token format');
      }

      // Parse and verify token
      const session = JWT.verify(token, config.jwtSecret);

      // Check the persmissions
      if (session.permissions) {
        if (session.permissions.indexOf(permission) !== -1) {
          await next();
        } else {
          throw Boom.forbidden('Invalid permissions');
        }
      } else {
        throw Boom.forbidden('Invalid permissions');
      }
    } else {
      throw Boom.unauthorized('No authorization token');
    }
  };
}
