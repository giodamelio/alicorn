import config from 'config';
import KoaRouter from 'koa-router';
import jwt from 'jsonwebtoken';

import { createChildLogger } from './logger';
import * as utils from './utils';
import { Session } from './models';

const logger = createChildLogger('api');
const router = new KoaRouter();

// Everything past this point is authenticated
router.use(async function (ctx, next) {
  try {
    // Parse the token
    const token = utils.parseAuthorizationHeader(ctx.headers.authorization);

    // Check to see if the user has a session
    const tokenData = jwt.verify(token, config.get('auth.jwt_key'));
    const hasSession = await Session.findOne({
      user: tokenData._id,
    }).populate('user').exec();

    if (hasSession) {
      // Add users session to the request context
      ctx.session = tokenData;
      await next();
    } else {
      // User has no session
      ctx.status = 401;
      ctx.body = {
        message: 'Not authenticated',
      };
    }
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      // Failed to decode the jwt token
      ctx.status = 401;
      ctx.body = {
        error: 'Invalid token',
      };
    } else if (err.message === 'Invalid authorization header') {
      // Failed to parse the authorization header
      ctx.status = 401;
      ctx.body = {
        error: 'Invalid authentication header',
      };
    } else {
      // Oops
      logger.error(err);
      ctx.status = 500;
    }
  }
});

// Create our routes
router.get('/', async (ctx) => {
  ctx.body = ctx.request.body;
});

export default router;
