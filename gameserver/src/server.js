import Koa from 'koa';
import config from 'config';
import KoaRouter from 'koa-router';
import bodyparser from 'koa-bodyparser';
import session from 'koa-session2';

import databaseFactory from './database';
import MongoStore from './mongoStore';
import auth from './auth';
import { createChildLogger } from './logger';

const logger = createChildLogger('main');

export default async function() {
  // Connect to the database
  const database = await databaseFactory();

  const app = new Koa();
  const router = new KoaRouter();

  // Add keys for signed cookies
  app.keys = config.get('cookie_keys');

  // Create our routes
  router.get('/', async (ctx) => {
    ctx.body = ctx.request.body;
  });

  // Setup our middleware
  app.use(bodyparser());
  app.use(session({
    store: new MongoStore(database),
  }));

  // Setup auth
  auth(app, router, database);

  // Register routes
  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
