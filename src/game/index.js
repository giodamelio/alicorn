// Base game class
export default class Game {
  constructor(logger, response) {
    this.log = logger;
    this.response = response;
  }

  start() {
    this.log.info(`Starting a game of ${this.gameName}`);

    this.response
      .status(200)
      .send(`Starting a game of TicTacToe`);
  }
}
