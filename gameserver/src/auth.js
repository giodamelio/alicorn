import { createChildLogger } from './logger';
import { User, Session } from './models';

const logger = createChildLogger('auth');

export default function (router) {
  // Create new users
  router.post('/auth/local/create', async (ctx) => {
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
  router.post('/auth/local/login', async (ctx, next) => {
    await next();
    const body = ctx.request.body;

    try {
      const userId = await User.checkPassword(body.username, body.password);

      if (userId) {
        // Add user to session
        const sessionId = ctx.cookies.get('koa:sess');
        const tmp = await Session.findOneAndUpdate({ _id: sessionId }, {
          user: {
            _id: userId,
            username: body.username,
          },
        }).exec();

        console.log(ctx.sessionId);

        ctx.status = 200;
        ctx.body = {
          message: 'Login successful',
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
}
