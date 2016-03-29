import net from 'net';

import _ from 'highland';

export default function socketHelper(port, input, expectedOutput) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    client.setEncoding('utf8');

    // Send the data
    client.connect(port, () => {
      if (Array.isArray(input)) {
        for (const item of input) {
          client.write(item);
        }
      } else if (typeof input === 'string') {
        client.write(input);
      } else {
        reject('Input must be a string or an array of strings');
      }

      client.end();
    });

    // Recieve the response
    _(client)
      .toArray((output) => {
        // Check that the output and expected output are the same
        output.should.eql([].concat(expectedOutput));

        resolve();
      });
  });
}
