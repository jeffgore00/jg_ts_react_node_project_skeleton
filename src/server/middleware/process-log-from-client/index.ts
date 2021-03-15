import { RequestHandler } from 'express';
import logger from '../../utils/logger';
import { NewLogRequest } from '../../../shared/types/logging';

const processLogFromClient: RequestHandler = (req: NewLogRequest, res) => {
  const { body } = req;
  const { message, logType, additionalData, logSource } = body;

  logger[logType](
    `Log from ${logSource.toUpperCase()}: ${message}`,
    additionalData,
  );

  res.sendStatus(200);
};

export default processLogFromClient;
