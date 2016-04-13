import rc from 'rc';

import { name } from './package.json';

const config = rc(name, {
  // Gameserver port
  port: 3141,

  // The secret to sign the jwts with
  // You MUST set this option
  // Use ' node -e "console.log(require('crypto').randomBytes(32).toString('hex'));"' to generate
  jwtSecret: null,
});

// Check if any of the mandatory config options are unset
for (const key in config) {
  if (config[key] === null) {
    throw new Error(`Config option '${key}' MUST be set`);
  }
}

export default config;
