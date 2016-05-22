import { Store } from 'koa-session2';

import { createChildLogger } from './logger';

const logger = createChildLogger('session_store');

export default class RethinkdbStore extends Store {
  constructor(database) {
    super();
    this.database = database;
    this.sessions = database.collection('sessions');
  }

  async get(sid) {
    return await this.sessions.findOne({
      _id: sid,
    });
  }

  async set(data, opts) {
    if (!opts.sid) {
      const session = await this.sessions.insertOne({
        data,
        createdAt: Date.now(),
      });
      logger.trace('Creating session', session.insertedId);
      return session.insertedId;
    }

    await this.sessions.findOneAndUpdate({ _id: opts.sid }, {
      data: data.data,
      usedAt: Date.now(),
    });
    logger.trace('Updating session', opts.sid);
    return opts.sid;
  }

  async destory(sid) {
    return await this.sessions.findOneAndDelete({ _id: sid });
  }
}
