/* eslint-disable @typescript-eslint/ban-ts-ignore */
import path from 'path';
import zlib from 'zlib';
import fs from 'fs';

import express, { RequestHandler, ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import apiRouter from './routers/api';
import logger from '../client/utils/logger';

const app = express();

/* APPLY THIRD-PARTY MIDDLEWARE */

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': "'self'", // provided by default if `directives` are not supplied, but since I am supplying custom directives below, I have to add this as well
        'script-src': ["'self'", 'https://unpkg.com'], // for React and React DOM
        'style-src': ["'self'", "'unsafe-inline'"], // for Styled Components
      },
    },
  })
);

/* Request/response logs. Do not use in `test` since API tests' console output
would be cluttered with logs. */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(morgan('short'));
}

/* DEFINE CUSTOM MIDDLEWARE */

let compressedJavascriptBundle: Buffer;

/* Swallow errors because this file isn't guaranteed to exist in test environments. Let the
middleware handle the 404 if the file is null. */
try {
  compressedJavascriptBundle = zlib.gzipSync(
    fs.readFileSync(path.join(__dirname, '../..', 'public/bundle.js'), 'utf8')
  );
} catch {
  compressedJavascriptBundle = null;
}

export const sendCompressedJsClientBundle: RequestHandler = (req, res) => {
  if (!compressedJavascriptBundle) {
    res.sendStatus(404);
  }
  res.header('Content-Encoding', 'gzip');
  res.header('Content-Type', 'application/javascript');
  res.send(compressedJavascriptBundle);
};

// Must be used before standard `express.static` middleware, which would send the file uncompressed.
app.get('/bundle.js', sendCompressedJsClientBundle);

// When the server gets a request for a _file_, look in the /public directory
app.use(express.static(path.join(__dirname, '../..', 'public')));

// Make JSON responses available on `response.body`
app.use(bodyParser.json());

// TODO: figure out what this does
app.use(bodyParser.urlencoded({ extended: true }));

export const sendResourceNotFound: RequestHandler = (req, res, next) => {
  res
    .status(404)
    .send(`Operation ${req.method} ${req.path} not recognized on this server.`);
};

// Error handler will not work without next! TODO: figure out why not.
export const sendErrorResponse: ErrorRequestHandler = (err, req, res, next) => {
  logger.error('SERVER 500 ERROR', { error: err });
  res.status(500).json({
    error: err.message || 'Internal server error.',
  });
};

/* APPLY CUSTOM MIDDLEWARE */
// app.get('/', sendHomepage);
app.use('/api', apiRouter);
app.use(sendResourceNotFound);
app.use(sendErrorResponse);

export default app;
