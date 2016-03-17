'use strict';

import app from './app';

const port = app.get('port');
const server = app.listen(port);

server.on('listening', () =>
  app.logger.info(`Feathers application started on ${app.get('host')}:${port}`)
);
