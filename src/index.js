import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

import config from './config';
import logger, { loggingMiddleware } from './logger';
import auth from './auth';
import userRoutes from './api/users';
import vantageServer from './vantage';

const app = new Koa();
const router = new Router();

// Log requests
app.use(loggingMiddleware());

// Handle errors
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    if (error.isBoom) {
      ctx.status = error.output.statusCode;
      ctx.body = error.output.payload;
    } else {
      ctx.logger.error(error);
    }
  }
});

// Parse request bodies
app.use(bodyParser());

router.get('/auth', auth('user'), async ctx => {
  ctx.body = ctx.request.body;
});

// Add our routes
app.use(router.routes());
app.use(router.allowedMethods());

logger.info(`Started server at http://localhost:${config.port}`);
app.listen(config.port);

// Start up vantage server for admin access
vantageServer();
