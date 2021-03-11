import path from 'path';

import express, { RequestHandler, ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import apiRouter from './routers/api';
import logger from './utils/logger';
import { getConfig } from '../shared/config';

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': "'self'", // provided by default if `directives` are not supplied, but since I am supplying custom directives below, I have to add this as well
        'script-src': ["'self'", 'https://unpkg.com'], // for React and React DOM
        'style-src': ["'self'", "'unsafe-inline'"], // for Styled Components
      },
    },
  }),
);

/* Necessary when the frontend domain differs from the backend domain, which happens when using
in development due to the use of webpack-dev-server (:8080 frontend -> :1337 backend). */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', getConfig().frontendUrl);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'content-type');
  next();
});

/* Request/response logs. Do not use in `test` since API tests' console output
would be cluttered with logs. */
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(morgan('short'));
}

// On a request for a .js file, modify the request to look for the gzipped version
app.get('*.js', (req, res, next) => {
  req.url += '.gz';
  res.set('Content-Encoding', 'gzip');
  res.header('Content-Type', 'application/javascript');
  next();
});

// When the server gets a request for a _file_, look in the /public directory
app.use(express.static(path.join(__dirname, '../..', 'public')));

// Make JSON responses available on `response.body`
app.use(express.json());

export const sendResourceNotFound: RequestHandler = (req, res) => {
  res
    .status(404)
    .send(`Operation ${req.method} ${req.path} not recognized on this server.`);
};

/* This needs to be defined with four arguments in order to satisfy Express's definition of
an error request hander, hence the unused `next` argument is necessary */
export const sendErrorResponse: ErrorRequestHandler = (
  err: Error,
  req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next,
) => {
  logger.error('SERVER 500 ERROR', { error: err });
  res.sendStatus(500);
};

/* APPLY CUSTOM MIDDLEWARE */
app.use('/api', apiRouter);
app.use(sendResourceNotFound);
app.use(sendErrorResponse);

export default app;
