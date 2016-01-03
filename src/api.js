import express from 'express';
import uuid from 'node-uuid';

import GAMES from './game/games';
import logger from './logger';
import { GameSchema } from './database';

const api = express();

// Start a game
api.get('/games/:name/start', function (req, res) {
  const gameName = req.params.name.toLowerCase();
  if (!GAMES.hasOwnProperty(gameName)) {
    res
      .status(400)
      .send('No such game');
  }

  // Generate uuid for game
  const id = uuid.v4();

  // Create a logger for our function
  const gameLogger = logger.child({ game: gameName, id });

  // Save game to database
  new GameSchema({
    id,
    type: gameName,
    state: {},
  }).save()
    .then(function () {
      // Start the game
      const gameRunner = new GAMES[gameName](gameLogger, res);
      gameRunner.start();
    })
    .error(function (err) {
      logger.error(err);
    });
});

export default api;
