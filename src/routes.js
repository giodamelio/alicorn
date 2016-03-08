export default function (server) {
  server.route({
    method: 'GET',
    path: '/',
    handler(request, reply) {
      reply('Hello, world!');
    },
  });

  server.route({
    method: 'GET',
    path: '/auth',
    config: {
      auth: 'users',
    },
    handler(request, reply) {
      reply('You need auth to see this message');
    },
  });
}
