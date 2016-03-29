import _ from 'highland';

import logger from './logger';

export default (socket) => {
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
        // Split the data by newline and pass down the stream
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
        // Send an error if we can't parse the data
        socket.write(JSON.stringify({
          error: 'Non JSON data recieved',
        }) + '\n');

        return null;
      }
    })
    .filter((data) => data)

    .tap((data) => logger.info('Got data', data))
    .done(() => {});
};
