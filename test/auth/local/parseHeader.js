import test from 'ava';

import { parseAuthorizationHeader } from '../../../src/auth';

test('no header', (t) => (
  t.throws(() => {
    parseAuthorizationHeader(null);
  })
));

test('too many parts', (t) => (
  t.throws(() => {
    parseAuthorizationHeader('B AKJSDH B');
  })
));

test('no bearer keyword', (t) => (
  t.throws(() => {
    parseAuthorizationHeader('asjdb asiodjasdasdoidjlk');
  })
));
