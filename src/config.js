import rc from 'rc';

import { name } from '../package.json';

const config = rc(name, {
  // The secret for our sessions. Genereate with
  // node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"
  jwtSecret: null,

  // Vantage port
  vantagePort: 31415,
});

if (!config.jwtSecret) {
  throw new Error('You MUST set a \'jwtSecret\' in the config!');
}

export default config;
