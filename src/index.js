import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

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

router.get('/', async ctx => {
  ctx.body = 'Hello World';
});

// Apply middleware
app.use(bodyParser()); // Parse request bodies
app.use(router.routes()); // Handle routes
app.use(router.allowedMethods()); // Handle unknown routes

console.log('App started at http://localhost:3141/');
app.listen(3141);
