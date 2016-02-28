import _ from 'lodash';

import Game from '../game';

export default class TicTacToe extends Game {
  constructor() {
    super();

    this.state = '         '.split('');
  }

  move(input) {
    const { index, player } = input;
    return new Promise((resolve, reject) => {
      if (index > this.state.length) {
        return reject('Index must be in the range 0-8');
      } else if (this.state[index] !== ' ') {
        return reject('Square already taken');
      } else if (['X', 'O'].indexOf(player) === -1) {
        return reject('Player must be X or O');
      }

      // Make the move
      this.state[index] = player;

      return resolve(this.state);
    });
  }

  toString() {
    return _(this.state)
      .chunk(3)

      // Add verticel lines
      .map(row => `${row.join('|')}\n`)

      // Add horizontal lines
      .join('-+-+-\n');
  }
}
