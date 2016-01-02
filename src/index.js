import express from 'express';

import api from './api';
import logger from './logger';
import './database';

// Create our app
const app = express();

// Mount the api
app.use('/api', api);

// Start the server
const PORT = 3141;
app.listen(PORT);
logger.info(`App listening at http://localhost:${PORT}`);
