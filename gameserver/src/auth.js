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
    const user = await User.create({
      username: body.username,
      password: body.password,
    });

    ctx.body = {
      id: user.id,
      username: user.username,
    };

    logger.trace({ username: user.username, id: user.id }, 'Created user');
  } catch (err) {
    const error = err.errors[0];
    ctx.status = 401;
    ctx.body = {
      error: error.message,
      path: error.path,
      type: error.type,
      value: error.value,
    };

    logger.trace({ username: body.username }, 'Failed to create user');
  }
});

// Login a user
router.post('/local/login', async (ctx) => {
  const body = ctx.request.body;

  try {
    // Find the user
    const user = await User.findOne({
      where: {
        username: body.username,
      },
    });

    if (user) {
      const isValidPassword = await user.checkPassword(body.password);
      if (isValidPassword) {
        // Create token
        const token = jwt.sign({
          id: user.id,
          username: user.username,
        }, config.get('auth.jwt_key'));

        // Create a new session
        await Session.create({
          userId: user.id,
        });

        ctx.status = 200;
        ctx.body = {
          message: 'Login successful',
          token,
        };

        logger.trace({ id: user.id }, 'User logged in');
      } else {
        ctx.status = 401;
        ctx.body = {
          error: 'Username or password is incorrect',
        };
        logger.trace({ id: user.id }, 'Incorrect password');
      }
    } else {
      ctx.status = 401;
      ctx.body = {
        error: 'Username or password is incorrect',
      };
      logger.trace({ username: body.username }, 'Incorrect username');
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
      where: {
        userId: tokenData.id,
      },
    });

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
