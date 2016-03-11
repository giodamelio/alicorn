import ms from 'ms';

import logger from '../logger';

// Simple logging middleware
export default function () {
  return async (ctx, next) => {
    // Add logger to context so routes can use it
    ctx.logger = logger;

    // Log request
    const start = Date.now();
    await next();
    const end = Date.now();
    logger.info({
      type: 'response',
      method: ctx.request.method,
      url: ctx.request.url,
      status: ctx.response.status,
      requestTime: ms(end - start),
    });
  };
}
