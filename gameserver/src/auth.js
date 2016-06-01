import KoaRouter from 'koa-router';
import jwt from 'jsonwebtoken';
import config from 'config';

import { createChildLogger } from './logger';
import { User, Session } from './models';

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
      const token = jwt.sign({ _id: userId, username: body.username },
        config.get('auth.jwt_key'));

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
