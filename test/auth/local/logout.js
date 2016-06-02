import test from 'ava';
import config from 'config';
import supertest from 'supertest-as-promised';
import jwt from 'jsonwebtoken';

import server from '../../../src/server';
import database from '../../../src/database';
import { User } from '../../../src/models';

test.beforeEach(async () => {
  await database.sync({
    force: true,
  });
  await User.create({
    username: 'AzureDiamond',
    password: 'hunter2-',
  });
});

test.skip('logout', (t) => (
  supertest(server.listen())
    .post('/auth/local/login')
    .send({
      username: 'AzureDiamond',
      password: 'hunter2-',
    })
    .expect(200)
    .expect((response) => {
      t.is(response.body.message, 'Login successful');
      const token = jwt.verify(response.body.token, config.get('auth.jwt_key'));
      t.is(token.username, 'AzureDiamond');
    })
));
