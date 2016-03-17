'use strict';

import assert from 'assert';
import app from '../../../src/app';

describe('user service', () => {
  it('registered the users service', () => {
    assert.ok(app.service('users'));
  });
});
