import config from 'config';

import serverFactory from './server';
import logger from './logger';

serverFactory()
  .then((server) => {
    const PORT = config.get('server.port');
    server.listen(PORT);
    logger.info(`Gameserver started at http://localhost:${PORT}`);
  });
