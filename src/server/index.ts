import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { Application } from 'express';

import app from './app';

export const isProductionMode = (): boolean =>
  process.env.NODE_ENV === 'production';
export const isDevelopmentMode = (): boolean => !isProductionMode();

function createServer(expressApp: Application): http.Server | https.Server {
  if (isDevelopmentMode()) {
    return http.createServer(expressApp);
  }

  const httpsOptions = {
    key: fs.readFileSync(
      path.join(__dirname, '../..', 'secrets/certs/key.pem'),
      'utf-8'
    ),
    cert: fs.readFileSync(
      path.join(__dirname, '../..', 'secrets/certs/cert.pem'),
      'utf-8'
    ),
  };

  return https.createServer(httpsOptions, expressApp);
}

const server = createServer(app);
const port = process.env.LISTEN_PORT || 3000;

server.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(
    `${isProductionMode() ? 'HTTPS' : 'HTTP'} server listening on port ${port}`
  )
);
