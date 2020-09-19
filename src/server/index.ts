import http from 'http';

import app from './app';

function createServer(expressApp: Express.Application): http.Server {
  return http.createServer(expressApp);
}

const server = createServer(app);
server.listen(3000, () => console.log('Listening on port 3000'));
