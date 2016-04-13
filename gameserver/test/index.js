import supertest from 'supertest-as-promised';

import gameserver from '../src/server';

describe('test', () => {
  it('should return hello world!', () => (
    supertest(gameserver.listen())
      .get('/')
      .expect(200)
      .expect('Hello World!')
  ));
});
