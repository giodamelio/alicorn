import KoaRouter from 'koa-router';

import { authenticate } from '../auth';
import matcher from './matcher';

const router = new KoaRouter();

// Everything past this point is authenticated
router.use(authenticate);

// Create our routes
router.get('/', async (ctx) => {
  ctx.body = ctx.request.body;
});

router.use('/matcher', matcher.routes(), matcher.allowedMethods());

export default router;
