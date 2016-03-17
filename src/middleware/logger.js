'use strict';

import winston from 'winston';

export default function (app) {
  // Add a logger to our app object for convenience
  app.logger = winston;

  // Log errors
  return function (error, req, res, next) {
    if (error) {
      let message = `Route: ${req.url} - ${error.message}`;
      if (error.code) {
        message = `(${error.code}) ${message}`;
      }

      if (error.code === 404) {
        winston.info(message);
      } else {
        winston.error(message);
        winston.info(error.stack);
      }
    }

    next(error);
  };
}
