'use strict';

import should from 'should';

import app from '../../../src/app';

describe('user service', () => {
  it('registered the users service', () => {
    should.exist(app.service('users'));
  });
});
