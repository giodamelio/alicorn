import should from 'should';

import TicTacToe from '../../src/games/tic_tac_toe';

describe('Games', function () {
  describe('TicTacToe', function () {
    let game;
    beforeEach(function () {
      game = new TicTacToe();
    });

    it('should create a new game', function () {
      should(game.state).deepEqual('         '.split(''));
    });

    it('should print game', function () {
      const emptyBoard = ' | | \n-+-+-\n | | \n-+-+-\n | | \n';
      game.toString().should.equal(emptyBoard);
    });

    it('should allow a move', function () {
      return game.move({
        index: 0,
        player: 'X',
      })
        .then(function (state) {
          state.should.deepEqual('X        '.split(''));
        });
    });

    it('should only allow moves on valid indexes', function () {
      return game.move({
        index: 666,
        player: 'X',
      })
        .catch(function (error) {
          error.should.equal('Index must be in the range 0-8');
        });
    });

    it('should not allow move on already taken square', function () {
      return game.move({
        index: 0,
        player: 'X',
      })
        .then(function () {
          return game.move({
            index: 0,
            player: 'O',
          });
        })
        .catch(function (error) {
          error.should.equal('Square already taken');
        });
    });

    it('should only allow players "X" and "O"', function () {
      return game.move({
        index: 0,
        player: 'Y',
      })
        .catch(function (error) {
          error.should.equal('Player must be X or O');
        });
    });
  });
});
