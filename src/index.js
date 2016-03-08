import Hapi from 'hapi';
import Good from 'good';
import GoodConsole from 'good-console';
import JWTAuth from 'hapi-auth-jwt2';

import config from './config';
import routes from './routes';
import auth from './auth';

const server = new Hapi.Server();

// Setup our connections
server.connection({
  port: 3141,
});

server.register([
  // Logging with Good
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

  // Authentication with JWT
  {
    register: JWTAuth,
  },
], (pluginError) => {
  if (pluginError) {
    throw pluginError;
  }

  // Setup the authentication
  auth(server);

  // Register the routes
  routes(server);

  // Start the server
  server.start((serverError) => {
    if (serverError) {
      throw serverError;
    }
    server.log('info', `Server running at: ${server.info.uri}`);
  });
});
