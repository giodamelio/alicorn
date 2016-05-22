import bunyan from 'bunyan';

import { name } from '../../package.json';

const logger = bunyan.createLogger({
  name,
  level: 'trace',
});

export default logger;

export function createChildLogger(modulename) {
  return logger.child({ module: modulename });
}
