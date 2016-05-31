import { Store } from 'koa-session2';

import { createChildLogger } from './logger';
import { Session } from './models';

const logger = createChildLogger('session_store');

export default class RethinkdbStore extends Store {
  async get(sid) {
    return await Session.findOne({
      _id: sid,
    });
  }

  async set(data, opts) {
    if (!opts.sid) {
      const session = await new Session({
        data,
        createdAt: Date.now(),
        usedAt: Date.now(),
      }).save();
      logger.trace({ id: session._id }, 'Creating session');
      return session._id;
    }

    await Session.findOneAndUpdate({ _id: opts.sid }, {
      data: data.data,
      usedAt: Date.now(),
    });
    logger.trace({ id: opts.sid }, 'Validating session');
    return opts.sid;
  }

  async destory(sid) {
    return await Session.findOneAndRemove({ _id: sid });
  }
}
