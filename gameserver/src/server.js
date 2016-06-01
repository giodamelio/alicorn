import Koa from 'koa';
import config from 'config';
import KoaRouter from 'koa-router';
import bodyparser from 'koa-bodyparser';

import database from './database';
import auth from './auth';
import { createChildLogger } from './logger';

const logger = createChildLogger('main');

const app = new Koa();
const router = new KoaRouter();

// Create our routes
router.get('/', async (ctx) => {
  ctx.body = ctx.request.body;
});

// Setup our middleware
app.use(bodyparser());

// Setup auth
auth(router);

// Register routes
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
