import { format } from 'winston';
import { serializeError, ErrorObject } from 'serialize-error';

import { LogType } from '../../../shared/types/logging';

export type BasicLog = {
  message: string;
  level: string;
  error?: Error | ErrorObject;
};

export const LogLevels = {
  [LogType.Error]: 0,
  [LogType.Warn]: 1,
  [LogType.Info]: 2,
  [LogType.Debug]: 3,
};

const errorFormatter = (log: BasicLog): BasicLog => {
  if (log.error instanceof Error) {
    // eslint-disable-next-line no-param-reassign
    log.error = serializeError(log.error);
  }
  return log;
};

export const winstonErrorFormatter = format((log) => errorFormatter(log));
