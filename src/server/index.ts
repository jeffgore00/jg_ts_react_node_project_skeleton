import http from 'http';
import https from 'https';

import app from './app';

export const isProductionMode = () => process.env.NODE_ENV === 'production';
export const isDevelopmentMode = () => !isProductionMode();

function createServer(expressApp: Express.Application): http.Server {
  const UTF8 = 'utf8';
  const ASCII = 'ascii';

  if (isDevelopmentMode()) {
    return http.createServer(app);
  }

  return https.createServer(
    // {
    //   cert:
    //   key:
    //   passphrase:
    // },
    {},
    app
  );
}

const server = createServer(app);

// eslint-disable-next-line no-console
server.listen(3000, () => console.log('Listening on port 3000'));
