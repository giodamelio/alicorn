import _ from 'highland';

import logger from './logger';
import { error } from './util';
import config from '../../config';

export default (socket) => {
  _(socket)
    // Convert buffer to string
    .map((data) => data.toString('utf8'))

    // Split up stream by newline
    .split()
    .filter((item) => item !== '')

    // Parse data to json ignoring any invalid lines
    .map((data) => {
      try {
        return JSON.parse(data);
      } catch (err) {
        // Send an error if we can't parse the data
        socket.write(error('Non JSON data recieved'));

        return null;
      }
    })
    .filter((data) => data)

    .tap((data) => logger.info('Got data', data))
    .done(() => {});
};
