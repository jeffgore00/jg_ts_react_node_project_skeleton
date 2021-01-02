import { RequestHandler } from 'express';
import logger from '../utils/logger';
import { NewLogBody } from '../../shared/types/logging';

const logMiddleware: RequestHandler = (req, res) => {
  const { body }: { body: NewLogBody } = req;
  const { message, logType, additionalData, logSource } = body;

  logger[logType](
    `Log from ${logSource.toUpperCase()}: ${message}`,
    additionalData
  );

  res.sendStatus(200);
};

export default logMiddleware;
