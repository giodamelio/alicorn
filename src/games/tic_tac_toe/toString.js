import _ from 'lodash';

// Print the board
export function toString(state) {
  return _(state.board)
    .chunk(3)

    // Add verticel lines
    .map(row => `${row.join('|')}\n`)

    // Add horizontal lines
    .join('-+-+-\n');
}
