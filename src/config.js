import rc from 'rc';

import { name } from '../package.json';

const config = rc(name, {
  jwtSecret: null,
});

if (!config.jwtSecret) {
  throw new Error('You MUST set a \'jwtSecret\' in the config!');
}

export default config;
