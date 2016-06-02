import test from 'ava';
import supertest from 'supertest-as-promised';

import gameserver from '../src/server';

test('should return hello world!', () => (
  supertest(gameserver.listen())
    .get('/api')
    .expect(200)
    .expect('Hello World!')
));
