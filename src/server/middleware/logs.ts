import { RequestHandler } from 'express';
import { Logger, LogTypes, Metadata } from '../utils/logger';

interface NewLogBody {
  message: string;
  logLevel: LogTypes;
  additionalData: Metadata;
}

const logMiddleware: RequestHandler = (req, res) => {
  const logger = new Logger();
  const { body }: { body: NewLogBody } = req;
  const { message, logLevel, additionalData } = body;

  logger[logLevel](`UI LOG: ${message}`, additionalData);

  res.sendStatus(200);
};

export default logMiddleware;
