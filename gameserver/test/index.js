import net from 'net';

import gameserver from '../src/server';
import socketHelper from './socketHelper';

const PORT = 3993;

describe('parsing', () => {
  let server; // eslint-disable-line prefer-const
  beforeEach(() => {
    server = net.createServer(gameserver);
    server.listen(PORT);
  });

  it('should error on lines that are not json', () =>
    socketHelper(
      PORT,
      'this is not json!',
      '{"error":"Non JSON data recieved"}\n'
    )
  );
});
