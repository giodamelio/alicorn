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
          client.write(`${item}\n`);
        }
      } else if (typeof input === 'string') {
        client.write(`${input}\n`);
      } else {
        reject('Input must be a string or an array of strings');
      }

      client.end();
    });

    // Recieve the response
    _(client)
      // Convert buffer to string
      .map((data) => data.toString('utf8'))

      // Split up by newline
      .split()
      .filter((item) => item !== '')

      // Parse string to JSON
      .map((item) => JSON.parse(item))

      // Check that the output and expected output are the same
      .toArray((output) => {
        output.should.eql([].concat(expectedOutput));

        resolve();
      });
  });
}
