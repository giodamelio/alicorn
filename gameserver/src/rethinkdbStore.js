import { Store } from 'koa-session2';
import rethinkdbdash from 'rethinkdbdash';

import { createChildLogger } from './logger';

const logger = createChildLogger('session_store');

export default class RethinkdbStore extends Store {
  constructor() {
    super();
    this.r = rethinkdbdash({
      db: 'alicorn',
    });
  }

  async get(sid) {
    return await this.r.table('sessions').get(sid).run();
  }

  async set(data, opts) {
    if (!opts.sid) {
      const session = await this.r.table('sessions').insert({
        data,
        createdAt: Date.now(),
      }).run();
      const sid = session.generated_keys[0];
      logger.trace('Creating session', sid);
      return sid;
    }

    await this.r.table('sessions').get(opts.sid).update({
      data: data.data,
      usedAt: Date.now(),
    });
    logger.trace('Updating session', opts.sid);
    return opts.sid;
  }

  async destory(sid) {
    return await this.r.table('sessions').get(sid).delete().run();
  }
}
