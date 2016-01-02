import bunyan from 'bunyan';

// Set up our logger
const logger = bunyan.createLogger({
  name: 'alicorn',
});
export default logger;
