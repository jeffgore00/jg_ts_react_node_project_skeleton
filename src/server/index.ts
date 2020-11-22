import http from 'http';
import { Application } from 'express';

import app from './app';
import logger from './utils/logger';

function createServer(expressApp: Application): http.Server {
  /* TODO: create HTTPS server if node env is production. Heroku magically takes care of this, but
  unsure if the same would be true for other platforms. */
  return http.createServer(expressApp);
}

const server = createServer(app);
const port = process.env.PORT || '1337';

server.listen(port, () => {
  logger.info(`HTTP server listening on port ${port}`);
});
