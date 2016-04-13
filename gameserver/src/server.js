import Koa from 'koa';

import logger from './logger';

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = 'Hello World!';
});

export default app;
