import Thinky, { type } from 'thinky';

// Setup database
const thinky = new Thinky({ db: 'alicorn' });

// Create schemas
const GameSchema = thinky.createModel('game', {
  id: type.string(),
  type: type.string(),
});

export { GameSchema };
