import Koa from 'koa';
import KoaRouter from 'koa-router';

import logger from './logger';

const app = new Koa();
const router = new KoaRouter();

// Create our routes
router.get('/', async (ctx) => {
  ctx.body = 'Hello World!';
});

// Register routes
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
