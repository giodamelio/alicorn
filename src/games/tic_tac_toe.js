import _ from 'lodash';

export default class TicTacToe {
  constructor() {
    this.state = '         '.split('');
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
