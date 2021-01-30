/* eslint-disable @typescript-eslint/ban-ts-ignore */
import path from 'path';
import express, { RequestHandler, ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import helmet from 'helmet';

import apiRouter from './routers/api';
import logger from '../client/utils/logger';

interface ResponseError extends Error {
  status?: number;
}

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

// When the server gets a request for a _file_, look in the /public directory
app.use(express.static(path.join(__dirname, '../..', 'public')));

// Make JSON responses available on `response.body`
app.use(bodyParser.json());

// TODO: figure out what this does
app.use(bodyParser.urlencoded({ extended: true }));

/* DEFINE CUSTOM MIDDLEWARE */
export const sendHomepage: RequestHandler = (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../..', 'public/index.html'),
    null,
    (err: ResponseError) => {
      if (err && !res.headersSent) {
        res.status(404).send('Main HTML file not found!');
      }
    }
  );
};

export const sendResourceNotFound: RequestHandler = (req, res, next) => {
  res
    .status(404)
    .send(`Operation ${req.method} ${req.path} not recognized on this server.`);
};

// Error handler will not work without next!
export const sendErrorResponse: ErrorRequestHandler = (err, req, res, next) => {
  logger.error('SERVER 500 ERROR', { error: err });
  res.status(500).json({
    error: err.message || 'Internal server error.',
  });
};

/* APPLY CUSTOM MIDDLEWARE */
app.get('/', sendHomepage);
app.use('/api', apiRouter);
app.use(sendResourceNotFound);
app.use(sendErrorResponse);

export default app;
