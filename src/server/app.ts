import path from 'path';
import express, { RequestHandler, ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import apiRouter from './routers/api';

interface ResponseError extends Error {
  status?: number;
}

const app = express();

// apply third-party middleware
// logging
if (app.get('env') !== 'test') app.use(morgan('dev'));

// ......
app.use(express.static(path.join(__dirname, '../..', 'public')));

// .........
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// define custom middleware
const sendHomepage: RequestHandler = (req, res) => {
  res.sendFile(
    path.join(__dirname, '../..', 'public/index.html'),
    null,
    (err: ResponseError) => {
      if (err) {
        res.status(404).send('Main HTML file not found!');
      }
    }
  );
};

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

// apply custom middleware
app.get('/', sendHomepage);
app.use('/api', apiRouter);
app.use(sendResourceNotFound);
app.use(sendErrorResponse);

export default app;
