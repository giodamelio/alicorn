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
  });
});
