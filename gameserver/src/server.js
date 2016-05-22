import Koa from 'koa';
import KoaRouter from 'koa-router';
import KoaBodyparser from 'koa-bodyparser';
import session from 'koa-session2';

import logger from './logger';
import RethinkdbStore from './rethinkdbStore';

const app = new Koa();
const router = new KoaRouter();

// Create our routes
router.get('/', async (ctx) => {
  ctx.body = ctx.request.body;
});

// Setup our middleware
app.use(KoaBodyparser());
app.keys = ['fix me'];
app.use(session({
  store: new RethinkdbStore(),
}));

// Register routes
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
