import Koa from 'koa';
import KoaRouter from 'koa-router';
import bodyparser from 'koa-bodyparser';

import auth from './auth';
import api from './api';
import './database';

const app = new Koa();
const router = new KoaRouter();

// Setup our middleware
app.use(bodyparser());

// Setup auth
router.use('/auth', auth.routes(), auth.allowedMethods());

// Setup the api
router.use('/api', api.routes(), api.allowedMethods());

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
