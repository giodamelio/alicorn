import Hapi from 'hapi';

const server = new Hapi.Server();

// Setup our connections
server.connection({
  port: 3141,
});

server.route({
  method: 'GET',
  path: '/',
  handler(request, reply) {
    reply('Hello, world!');
  },
});

// Start the server
server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});
