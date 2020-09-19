import path from 'path';
import express, { RequestHandler, ErrorRequestHandler } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import apiRouter from './routers/api';

const app = express();

// logging middleware
app.use(morgan('dev'));

// static middleware
app.use(express.static(path.join(__dirname, '../..', 'public')));

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// custom middleware
const sendHomepage: RequestHandler = (req, res) =>
  res.sendFile(path.join(__dirname, '../..', 'public/index.html'));

const sendResourceNotFound: RequestHandler = (req, res) => {
  res.status(404).send(`Path ${req.path} not found on this server.`);
};

const sendErrorResponse: ErrorRequestHandler = (err, req, res) =>
  res.status(err.status || 500).send(err.message || 'Internal server error.');

// apply custom middleware
app.get('/', sendHomepage);
app.use('/api', apiRouter);
app.use(sendResourceNotFound);
app.use(sendErrorResponse);

export default app;
