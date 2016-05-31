import { createChildLogger } from './logger';
import { User } from './models';

const logger = createChildLogger('auth');

export default function (router) {
  // Create new users
  router.post('/auth/local', async (ctx) => {
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
}
