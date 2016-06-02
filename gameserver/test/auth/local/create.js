import test from 'ava';
import supertest from 'supertest-as-promised';
import shortid from 'shortid';

import gameserver from '../../../src/server';
import database from '../../../src/database';

test.beforeEach(async () => {
  await database.sync({
    force: true,
  });
});

test('create user', (t) => {
  t.plan(2);

  return supertest(gameserver.listen())
    .post('/auth/local/create')
    .send({
      username: 'AzureDiamond',
      password: 'hunter2-',
    })
    .expect(200)
    .expect((response) => {
      t.is(response.body.username, 'AzureDiamond');
      t.true(shortid.isValid(response.body.id));
    });
});

test('username too short', () => (
  supertest(gameserver.listen())
    .post('/auth/local/create')
    .send({
      username: 'short',
      password: 'hunter2-',
    })
    .expect(401)
    .expect({
      error: 'Validation len failed',
      path: 'username',
      type: 'Validation error',
      value: {},
    })
));

test('username too long', () => (
  supertest(gameserver.listen())
    .post('/auth/local/create')
    .send({
      username: 'fxfxfxfxfxfxfxfxfxfxfxfxfxfxfxfxf',
      password: 'hunter2-',
    })
    .expect(401)
    .expect({
      error: 'Validation len failed',
      path: 'username',
      type: 'Validation error',
      value: {},
    })
));

test('password too short', () => (
  supertest(gameserver.listen())
    .post('/auth/local/create')
    .send({
      username: 'AzureDiamond',
      password: 'ha',
    })
    .expect(401)
    .expect({
      error: 'Validation len failed',
      path: 'password',
      type: 'Validation error',
      value: {},
    })
));

test('password too long', () => (
  supertest(gameserver.listen())
    .post('/auth/local/create')
    .send({
      username: 'AzureDiamond',
      password: 'hjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhj', // eslint-disable-line
    })
    .expect(401)
    .expect({
      error: 'Validation len failed',
      path: 'password',
      type: 'Validation error',
      value: {},
    })
));
