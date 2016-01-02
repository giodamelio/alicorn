import express from 'express';

import GAMES from './game/games';
import logger from './logger';

const api = express();

// Start a game
api.get('/games/:name/start', function (req, res) {
  const gameName = req.params.name.toLowerCase();
  if (!GAMES.hasOwnProperty(gameName)) {
    res
      .status(400)
      .send('No such game');
  }

  res
    .status(200)
    .send(`Starting a game of ${gameName}`);

  const gameLogger = logger.child({ game: gameName });
  const game = new GAMES[gameName](gameLogger);
  game.start();
});

export default api;
