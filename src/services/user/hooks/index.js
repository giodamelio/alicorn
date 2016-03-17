'use strict';

import hooks from 'feathers-hooks';
import { hooks as auth } from 'feathers-authentication';

export const before = {
  all: [],
  find: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.requireAuth(),
  ],
  get: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.requireAuth(),
  ],
  create: [
    auth.hashPassword(),
  ],
  update: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.requireAuth(),
  ],
  patch: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.requireAuth(),
  ],
  remove: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.requireAuth(),
  ],
};

export const after = {
  all: [hooks.remove('password')],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
