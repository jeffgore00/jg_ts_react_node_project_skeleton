import http from 'http';
import https from 'https';
// import fs from 'fs';
// import path from 'path';
import { Application } from 'express';
// import { add } from 'date-fns';
// import { pki } from 'node-forge';

import app from './app';

export const isProductionMode = (): boolean =>
  process.env.NODE_ENV === 'production';
export const isDevelopmentMode = (): boolean => !isProductionMode();

function createServer(expressApp: Application): http.Server | https.Server {
  // if (isDevelopmentMode()) {
  return http.createServer(expressApp);
  // }

  // const load = (name: string): string =>
  //   fs.readFileSync(
  //     path.join(__dirname, '../..', `secrets/certs/${name}.pem`),
  //     'utf-8'
  //   );

  // const key = load('key');
  // const cert = load('cert');
  // const key = 'test';
  // const cert = 'test';

  // const { validity } = pki.certificateFromPem(cert);

  // const currentTimestamp = new Date();
  // // if (validity.notBefore > currentTimestamp) {
  // //   throw new Error('Certificate not yet valid');
  // // }
  // // if (validity.notAfter < currentTimestamp) {
  // //   throw new Error('Certificate expired');
  // // }
  // // if (add(currentTimestamp, { days: 30 }) >= validity.notAfter) {
  // //   /* Presumably you can set up your logging service to send you an email when
  // //   this log occurs */
  // //   // eslint-disable-next-line no-console
  // //   console.warn(`Certificate expiring on ${validity.notAfter}`);
  // // }

  // return https.createServer({ key, cert }, expressApp);
}

const server = createServer(app);
const port = process.env.PORT || '3000';

server.listen(port, () =>
  // eslint-disable-next-line no-console
  console.log(
    `${isProductionMode() ? 'HTTPS' : 'HTTP'} server listening on port ${port}`
  )
);
