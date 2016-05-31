import mongoose from 'mongoose';
import config from 'config';

import { createChildLogger } from './logger';

const logger = createChildLogger('database');
mongoose.connect(config.get('database.mongo.connectionURL'));
logger.info('Connected to database');
