import net from 'net';

import server from './server';
import logger from './logger';

const gameserver = net.createServer(server);

const PORT = 3141;
gameserver.listen(PORT);
logger.info('Gameserver started at tcp://localhost:3141');
