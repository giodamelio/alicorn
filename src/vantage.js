import Vantage from 'vantage';

export default function (server) {
  const vantageServer = new Vantage();

  vantageServer
    .delimiter('$')
    .listen(2002, () => {
      server.log('info', 'Started vantage server at http://localhost:31415');
    });
}
