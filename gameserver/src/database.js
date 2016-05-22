import { MongoClient } from 'mongodb';
import config from 'config';
import { createChildLogger } from './logger';

const logger = createChildLogger('database');

let database;
export default async function() {
  if (!database) {
    try {
      database = await MongoClient.connect(
        config.get('database.mongo.connectionURL')
      );
    } catch (err) {
      logger.error(err);
    }
  }

  return database;
}
