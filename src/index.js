import Koa from 'koa';

const app = new Koa();

// Handle errors
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.body = {
      message: err.message,
    };
    ctx.status = err.status || 500;
  }
});

app.use(async ctx => {
  ctx.body = 'Hello World!';
});

console.log('App started at http://localhost:3141/');
app.listen(3141);
