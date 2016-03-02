import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

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

// Apply middleware
app.use(bodyParser()); // Parse request bodies

app.use(async ctx => {
  console.log(ctx.request.body);
  ctx.body = 'Hello World!';
});

console.log('App started at http://localhost:3141/');
app.listen(3141);
