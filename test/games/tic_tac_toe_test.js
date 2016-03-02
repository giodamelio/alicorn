import ticTacToe, { checkWinner } from '../../src/games/tic_tac_toe';

describe('Games', function () {
  describe('TicTacToe', function () {
    let newGameState;
    beforeEach(function () {
      return ticTacToe(null)
        .then(function (state) {
          newGameState = state;
        });
    });

    describe('validation', function () {
      it('should create a new game', function () {
        return ticTacToe(null)
          .should.finally.deepEqual({
            status: 'pregame',
            board: [' ', ' ', ' ',
                    ' ', ' ', ' ',
                    ' ', ' ', ' '],
            nextPlayer: 'X',
            winner: null,
          });
      });

      it('should error on invalid player', function () {
        return ticTacToe(newGameState, 0, 'Y')
          .should.be.rejectedWith('Player must be "X" or "O"');
      });

      it('should error on invlid move index', function () {
        return ticTacToe(newGameState, 10, 'X')
          .should.be.rejectedWith('Move must be in range 0-8');
      });
    });

    describe('game', function () {
      it('should fail if it is not the players turn', function () {
        return ticTacToe(newGameState, 0, 'O')
          .should.be.rejectedWith('Not your turn');
      });

      it('should fail move if square is already taken', function () {
        return ticTacToe({
          ...newGameState,
          board: ['X', ' ', ' ',
                  ' ', ' ', ' ',
                  ' ', ' ', ' '],
        }, 0, 'X')
          .should.be.rejectedWith('square is already taken');
      });

      it('should allow valid move', function () {
        return ticTacToe(newGameState, 0, 'X')
          .should.eventually.deepEqual({
            ...newGameState,
            board: ['X', ' ', ' ',
                    ' ', ' ', ' ',
                    ' ', ' ', ' '],
            status: 'playing',
            nextPlayer: 'O',
          });
      });

      it('should end game when a player has won', function () {
        return ticTacToe({
          ...newGameState,
          board: ['X', 'X', ' ',
                  ' ', ' ', ' ',
                  ' ', ' ', ' '],
          nextPlayer: 'X',
        }, 2, 'X').should.eventually.deepEqual({
          ...newGameState,
          board: ['X', 'X', 'X',
                  ' ', ' ', ' ',
                  ' ', ' ', ' '],
          status: 'done',
          nextPlayer: 'X',
          winner: 'X',
        });
      });

      it('should handle draw', function () {
        return ticTacToe({
          ...newGameState,
          board: ['X', 'O', 'X',
                  'O', 'X', 'X',
                  'O', ' ', 'O'],
        }, 7, 'X').should.eventually.deepEqual({
          ...newGameState,
          board: ['X', 'O', 'X',
                  'O', 'X', 'X',
                  'O', 'X', 'O'],
          status: 'done',
          nextPlayer: 'X',
          winner: 'draw',
        });
      });
    });

    describe('checkWinner', function () {
      it('won with a row', function () {
        const boards = [
          ['X', 'X', 'X',
           ' ', ' ', ' ',
           ' ', ' ', ' '],
          [' ', ' ', ' ',
           'X', 'X', 'X',
           ' ', ' ', ' '],
          [' ', ' ', ' ',
           ' ', ' ', ' ',
           'X', 'X', 'X'],
        ];
        Promise.all(boards.map(function (board) {
          return checkWinner(
            board,
            'X'
          ).should.equal(true);
        }));
      });

      it('won with a column', function () {
        const boards = [
          ['X', ' ', ' ',
           'X', ' ', ' ',
           'X', ' ', ' '],
          [' ', 'X', ' ',
           ' ', 'X', ' ',
           ' ', 'X', ' '],
          [' ', ' ', 'X',
           ' ', ' ', 'X',
           ' ', ' ', 'X'],
        ];
        Promise.all(boards.map(function (board) {
          return checkWinner(
            board,
            'X'
          ).should.equal(true);
        }));
      });

      it('won with a diagonal', function () {
        const boards = [
          ['X', ' ', ' ',
           ' ', 'X', ' ',
           ' ', ' ', 'X'],
          [' ', ' ', 'X',
           ' ', 'X', ' ',
           'X', ' ', ' '],
        ];
        Promise.all(boards.map(function (board) {
          return checkWinner(
            board,
            'X'
          ).should.equal(true);
        }));
      });

      it('no winner', function () {
        const boards = [
          ['X', ' ', ' ',
           ' ', 'X', ' ',
           ' ', ' ', 'O'],
          [' ', ' ', 'X',
           ' ', 'O', ' ',
           'X', ' ', ' '],
        ];
        Promise.all(boards.map(function (board) {
          return checkWinner(
            board,
            'X'
          ).should.equal(false);
        }));
      });
    });
  });
});
