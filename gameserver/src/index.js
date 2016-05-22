import config from 'config';

import server from './server';
import logger from './logger';

const PORT = config.get('server.port');
server.listen(PORT);
logger.info(`Gameserver started at http://localhost:${PORT}`);
