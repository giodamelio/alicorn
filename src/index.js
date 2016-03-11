import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import config from './config';
import logger from './logger';
import {
  loggerMiddleware,
  errorMiddleware,
  authMiddleware,
} from './middleware';

import vantageServer from './vantage';
import userRoutes from './api/users';

// Connect to database
mongoose.connect(config.mongoUrl);
const db = mongoose.connection;
db.on('error', (err) => {
  logger.fatal(`Database error: ${err}`);
});
db.once('open', () => {
  logger.info('Connected to database');
});

// Create server
const app = new Koa();
const router = new Router();

// Add our middleware
app.use(loggerMiddleware());  // Log requests
app.use(errorMiddleware());   // Handle errors
app.use(bodyParser());        // Parse request bodies

// Add our routes

// Users api
router.use('/api/u', userRoutes.routes(), userRoutes.allowedMethods());
app.use(router.routes(), router.allowedMethods());

// Start the server
logger.info(`Started server at http://localhost:${config.port}`);
app.listen(config.port);

// Start up vantage server for admin access
vantageServer();
