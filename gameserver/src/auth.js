import KoaRouter from 'koa-router';
import jwt from 'jsonwebtoken';
import config from 'config';

import { createChildLogger } from './logger';
import { User, Session } from './models';
import * as utils from './utils';

const logger = createChildLogger('auth');

const router = new KoaRouter();

// Create new users
router.post('/local/create', async (ctx) => {
  const body = ctx.request.body;

  logger.trace({ username: body.username }, 'Attempting to create user');

  try {
    const user = await new User(body).save();
    logger.trace({ username: user.username, id: user._id }, 'Created user');
    ctx.body = {
      id: user._id,
      username: user.username,
    };
  } catch (err) {
    if (err.name === 'ValidationError') {
      for (const error in err.errors) {
        if (err.errors.hasOwnProperty(error)) {
          ctx.status = 401;
          ctx.body = {
            error: err.errors[error].message,
          };
          break;
        }
      }

      return;
    } else if (err.code === 11000) {
      ctx.status = 401;
      ctx.body = {
        error: 'Username is already taken',
      };

      return;
    }

    logger.error(err);
    throw err;
  }
});

// Login a user
router.post('/local/login', async (ctx) => {
  const body = ctx.request.body;

  try {
    const userId = await User.checkPassword(body.username, body.password);

    if (userId) {
      // Create token
      const token = jwt.sign({
        _id: userId,
        username: body.username,
      }, config.get('auth.jwt_key'));

      // Add session to database
      await new Session({
        user: userId,
      }).save();

      ctx.status = 200;
      ctx.body = {
        message: 'Login successful',
        token,
      };
    } else {
      ctx.status = 401;
      ctx.body = {
        error: 'Username or password is incorrect',
      };
    }
  } catch (err) {
    logger.error(err);
    ctx.status = 500;
  }
});

export default router;

// Authentication middleware
export async function authenticate(ctx, next) {
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
}
