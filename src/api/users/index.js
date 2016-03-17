import Router from 'koa-router';
import joi from 'joi';

import User from '../../schemas/user';
import { validateMiddleware } from '../../middleware';

const router = new Router();

router.post('/create_user',
  validateMiddleware.body({
    username: joi.string().alphanum().min(8).max(16).required(),
  }),
  async (ctx) => {
    ctx.logger.trace(`Creating new user: ${ctx.request.body.username}`);

    const user = new User({
      username: ctx.request.body.username,
    });

    const newUser = await user.save();
    ctx.body = newUser;
  }
);

export default router;
