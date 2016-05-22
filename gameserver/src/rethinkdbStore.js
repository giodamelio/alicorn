import { Store } from 'koa-session2';
import rethinkdbdash from 'rethinkdbdash';

import logger from './logger';

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
      logger.info('Creating session');
      const session = await this.r.table('sessions').insert({
        data,
      }).run();
      return session.generated_keys[0];
    }

    logger.info('Updating session');
    await this.r.table('sessions').get(opts.sid).update({
      data: data.data,
    });
    return opts.sid;
  }

  async destory(sid) {
    return await this.r.table('sessions').get(sid).delete().run();
  }
}
