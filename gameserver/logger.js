import bunyan from 'bunyan';

import { name } from '../package.json';

const logger = bunyan.createLogger({
  name,
});

export default logger;
