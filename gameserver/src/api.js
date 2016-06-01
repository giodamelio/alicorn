import config from 'config';
import KoaRouter from 'koa-router';
import koajwt from 'koa-jwt';

const router = new KoaRouter();

// Everything past this point is authenticated
router.use(koajwt({
  secret: config.get('auth.jwt_key'),
}));

// Create our routes
router.get('/', async (ctx) => {
  ctx.body = ctx.request.body;
});

export default router;
