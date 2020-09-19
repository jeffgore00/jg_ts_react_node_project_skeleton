import path from 'path';
import express, { RequestHandler, ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import apiRoutes from './api';

const app = express();

// logging middleware
app.use(morgan('dev'));

// static middleware
app.use(express.static(path.join(__dirname, '../..', 'public')));

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 'API' routes
// app.use('/api', apiRoutes);

// 404 middleware
const notFoundMiddleware: RequestHandler = (req, res, next) => {
  if (path.extname(req.path).length > 0) {
    res.status(404).send('Not found');
  }
  next();
};

app.use(notFoundMiddleware);

// send index.html
const sendHomepageMiddleware: RequestHandler = (req, res) =>
  res.sendFile(path.join(__dirname, '../..', 'public/index.html'));

app.use('*', sendHomepageMiddleware);

// error handling endware
const errorHandlingMiddleware: ErrorRequestHandler = (err, req, res) =>
  res.status(err.status || 500).send(err.message || 'Internal server error.');

app.use(errorHandlingMiddleware);

export default app;
