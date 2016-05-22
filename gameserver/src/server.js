import Koa from 'koa';
import KoaRouter from 'koa-router';
import bodyparser from 'koa-bodyparser';
import session from 'koa-session2';

import RethinkdbStore from './rethinkdbStore';

const app = new Koa();
const router = new KoaRouter();

// Create our routes
router.get('/', async (ctx) => {
  ctx.body = ctx.request.body;
});

// Setup our middleware
app.use(bodyparser());
app.use(session({
  store: new RethinkdbStore(),
}));

// Register routes
app.use(router.routes());
app.use(router.allowedMethods());

export default app;
