import bunyan from 'bunyan';
import ms from 'ms';

import { name } from '../package.json';

const logger = bunyan.createLogger({
  name,
});

export default logger;

// Simple logging middleware
export function loggingMiddleware() {
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
