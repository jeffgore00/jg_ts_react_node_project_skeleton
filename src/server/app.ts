import path from 'path';
import express, { RequestHandler, ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import apiRouter from './routers/api';

interface ResponseError extends Error {
  status?: number;
}

const app = express();

/* APPLY THIRD-PARTY MIDDLEWARE */

// Request/response logs. Do not use in test since API tests' console output would be cluttered.
if (app.get('env') === 'development') {
  app.use(morgan('dev'));
} else if (app.get('env') === 'production') {
  app.use(morgan('short'));
}

// When the server gets a request for a file, look in the /public directory
app.use(express.static(path.join(__dirname, '../..', 'public')));

// Make JSON responses available on `response.body`
app.use(bodyParser.json());

// (figure this out)
app.use(bodyParser.urlencoded({ extended: true }));


/* DEFINE CUSTOM MIDDLEWARE */
const sendHomepage: RequestHandler = (req, res) => {
  res.sendFile(
    path.join(__dirname, '../..', 'public/index.html'),
    null,
    (err: ResponseError) => {
      if (err && !res.headersSent) {
        res.status(404).send('Main HTML file not found!');
      }
    }
  );
};

// `next` is not used in the below two functions, but NOT passing it to the function resulted
// in some puzzling broken behavior.
const sendResourceNotFound: RequestHandler = (req, res, next) => {
  res
    .status(404)
    .send(`Operation ${req.method} ${req.path} not recognized on this server.`);
};

const sendErrorResponse: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error.',
  });
};

/* APPLY CUSTOM MIDDLEWARE */
app.get('/', sendHomepage);
app.use('/api', apiRouter);
app.use(sendResourceNotFound);
app.use(sendErrorResponse);

export default app;
