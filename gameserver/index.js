import net from 'net';

import _ from 'highland';

import logger from './logger';

const server = net.createServer((socket) => {
  _(socket)
    // Convert buffer to string
    .map((data) => data.toString('utf8'))

    // Split up stream by newline
    .consume((err, data, push, next) => {
      if (err) {
        // Pass errors along the stream and consume next value
        push(err);
        next();
      } else if (data === _.nil) {
        // Pass nil (end event) along the stream
        push(null, data);
      } else {
        for (const item of data.split('\n')) {
          push(null, item);
        }
        next();
      }
    })

    // Parse data to json ignoring any invalid lines
    .map((data) => {
      try {
        return JSON.parse(data);
      } catch (err) {
        return null;
      }
    })
    .filter((data) => data)

    .tap((data) => logger.info('Got data', data))
    .done(() => {});
});

const PORT = 3141;
server.listen(PORT);
logger.info('Gameserver started at tcp://localhost:3141');
