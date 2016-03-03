import Hapi from 'hapi';
import Good from 'good';
import GoodConsole from 'good-console';

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

server.register([
  {
    register: Good,
    options: {
      reporters: [
        {
          reporter: GoodConsole,
          events: {
            request: '*',
            response: '*',
            log: '*',
          },
        },
      ],
    },
  },
], (pluginError) => {
  if (pluginError) {
    throw pluginError;
  }

  // Start the server
  server.start((serverError) => {
    if (serverError) {
      throw serverError;
    }
    server.log('info', `Server running at: ${server.info.uri}`);
  });
});
