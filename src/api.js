import express from 'express';

import GAMES from './game/games';
console.log(GAMES);

const api = express();

// Start a game
api.get('/games/:name/start', function (req, res) {
  res.send(JSON.stringify(GAMES));
});

export default api;
