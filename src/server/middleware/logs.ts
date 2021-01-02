import { RequestHandler } from 'express';
import { Logger, LogTypes, Metadata } from '../utils/logger';

interface NewLogBody {
  message: string;
  logType: LogTypes;
  additionalData: Metadata;
}

const logMiddleware: RequestHandler = (req, res) => {
  const logger = new Logger();
  const { body }: { body: NewLogBody } = req;
  const { message, logType, additionalData } = body;

  logger[logType](`UI LOG: ${message}`, additionalData);

  res.sendStatus(200);
};

export default logMiddleware;
