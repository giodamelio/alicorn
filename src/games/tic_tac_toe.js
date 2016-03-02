import _ from 'lodash';

// Check if a player has won the game
export function checkWinner(board, player) {
  // Did the player win any rows
  if (_(board)
      .chunk(3)
      .filter(squares => squares.every(square => square === player))
      .value()
      .length > 0) {
    return true;
  }

  // Did the player win any columns
  if (_(board)
      .chunk(3)
      .unzip()
      .filter(squares => squares.every(square => square === player))
      .value()
      .length > 0) {
    return true;
  }

  // Did the player win either diagonal
  // Hard code out of lazyness
  if ((board[0] === player &&
      board[4] === player &&
      board[8] === player) || (
      board[2] === player &&
      board[4] === player &&
      board[6] === player)) {
    return true;
  }

  return false;
}

export default function ticTacToe(inputState, move, player) {
  return new Promise((resolve, reject) => {
    let state = inputState;
    /// Validate inputs

    // If the game does not exist create it
    /* eslint-disable no-else-return */
    if (!state) {
      return resolve({
        status: 'pregame',
        board: '         '.split(''),
        nextPlayer: 'X',
        winner: null,
      });
    } else {
      state = {
        ...state,
        status: 'playing',
      };
    }
    /* eslint-enable no-else-return */

    // Check move index
    if (move < 0 || move > 8) {
      return reject(new Error('Move must be in range 0-8'));
    }

    // Check player name
    if (['X', 'O'].indexOf(player) < 0) {
      return reject(new Error('Player must be "X" or "O"'));
    }

    /// Play game

    // Check if it is players turn
    if (player !== state.nextPlayer) {
      return reject(new Error('Not your turn'));
    }

    // Check if square is taken
    if (state.board[move] !== ' ') {
      return reject(new Error('square is already taken'));
    }

    // Make a move
    const newBoard = state.board.concat();
    newBoard[move] = state.nextPlayer;
    state = {
      ...state,
      board: newBoard,
    };

    // Check if the game is done
    if (checkWinner(state.board, state.nextPlayer)) {
      return resolve({
        ...state,
        status: 'done',
        winner: 'X',
      });
    }

    // Check for a draw
    if (state.board.indexOf(' ') < 0) {
      return resolve({
        ...state,
        status: 'done',
        winner: 'draw',
      });
    }

    // Update the next player
    state = {
      ...state,
      nextPlayer: state.nextPlayer === 'X' ? 'O' : 'X',
    };

    // Move done
    return resolve(state);
  });
}

// Print the board
export function toString(state) {
  return _(state.board)
    .chunk(3)

    // Add verticel lines
    .map(row => `${row.join('|')}\n`)

    // Add horizontal lines
    .join('-+-+-\n');
}
