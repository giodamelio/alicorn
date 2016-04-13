import server from './server';
import logger from './logger';
import config from '../../config.js';

server.listen(config.port);
logger.info(`Gameserver started at http://localhost:${config.port}`);
