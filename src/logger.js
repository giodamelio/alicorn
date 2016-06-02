import bunyan from 'bunyan';

import { name } from '../package.json';

let logger;
if (process.env.NODE_ENV === 'test') {
  logger = bunyan.createLogger({
    name,
    level: 'trace',
    streams: [],
  });
} else {
  logger = bunyan.createLogger({
    name,
    level: 'trace',
  });
}

export default logger;

export function createChildLogger(modulename) {
  return logger.child({ module: modulename });
}
