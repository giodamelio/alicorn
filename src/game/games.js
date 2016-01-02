import fs from 'fs';
import path from 'path';

import _ from 'lodash';

// Build a list of all the games
const GAMES = _(fs.readdirSync(path.join(__dirname, 'games/')))
  // Load the games
  .map(function (file) {
    return require(path.join(__dirname, 'games/', file));
  })

  // Get default export
  .map((game) => game.default)

  // Convert array into an object
  .indexBy((game) => game.name.toLowerCase())
  .value();

export default GAMES;
