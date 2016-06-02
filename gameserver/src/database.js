import Sequelize from 'sequelize';
import config from 'config';

import { createChildLogger } from './logger';

const logger = createChildLogger('database');

let database;
if (process.env.NODE_ENV === 'development') {
  database = new Sequelize('alicorn', null, null, {
    logging: false,
    ...config.get('database'),
  });
  database.sync();
}

logger.info('Connected to database');
export default database;
