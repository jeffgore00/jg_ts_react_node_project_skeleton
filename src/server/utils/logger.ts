/* eslint-disable import/no-extraneous-dependencies */
import winston, {
  createLogger,
  format,
  transports,
  LogCallback,
} from 'winston';
import chalk from 'chalk';
import { serializeError, ErrorObject } from 'serialize-error';

import { LogType, Metadata } from '../../shared/types/logging';

type BasicLog = {
  message: string;
  level: string;
  error?: Error | ErrorObject;
};

const LogLevels = {
  [LogType.Error]: 0,
  [LogType.Warn]: 1,
  [LogType.Info]: 2,
  [LogType.Debug]: 3,
};

const labels: { [index: string]: string } = {
  info: chalk.bgCyan.black(' INFO '),
  debug: chalk.bgMagenta.black(' DEBUG '),
  warn: chalk.bgYellow.black(' WARN '),
  error: chalk.bgRed.black(' ERROR '),
};

const devLoggerColorizer: {
  [index: string]: (logMessage: string) => string;
} = {
  info: (logMessage: string): string => chalk.cyan(logMessage),
  debug: (logMessage: string): string => chalk.magenta(logMessage),
  warn: (logMessage: string): string => chalk.yellow(logMessage),
  error: (logMessage: string): string => chalk.red(logMessage),
};

export const errorFormatter = (log: BasicLog): BasicLog => {
  if (log.error instanceof Error) {
    // eslint-disable-next-line no-param-reassign
    log.error = serializeError(log.error);
  }
  return log;
};

const winstonErrorFormatter = format((log) => errorFormatter(log));

const developmentFormatter = format.printf((log) => {
  const { level, message, timestamp, ...additionalData } = log;
  const additionalDataKeyVals = Object.entries(additionalData).map(
    ([key, value]: [string, unknown]) => {
      let groomedValue = value;
      if (typeof value === 'object') {
        groomedValue = JSON.stringify(value);
      }
      return `data_${key}=${groomedValue}`;
    },
  );
  const additionalDataStr =
    additionalDataKeyVals.length > 0
      ? ` ${chalk.dim(additionalDataKeyVals.join(' '))}`
      : '';

  return `${labels[level]} ${devLoggerColorizer[level](
    `${message}${additionalDataStr}`,
  )} ${chalk.gray(timestamp)}`;
});

const developmentLogger = createLogger({
  levels: LogLevels,
  transports: [
    new transports.Console({
      level: 'debug', // means that this and all levels below it will be logged
      format: format.combine(
        format.timestamp(),
        winstonErrorFormatter(),
        developmentFormatter,
      ),
    }),
  ],
});

const productionLogger = createLogger({
  levels: LogLevels,
  transports: [
    new transports.Console({
      level: 'info', // means that this and all levels below it will be logged
      format: format.combine(
        format.timestamp(),
        winstonErrorFormatter(),
        format.json(),
      ),
    }),
  ],
});

type LoggerMethod = (
  message: string,
  metadata?: Metadata,
  callback?: LogCallback,
) => void;

interface ServerSideLogger {
  internalLogger: winston.Logger;
  info: LoggerMethod;
  debug: LoggerMethod;
  error: LoggerMethod;
  warn: LoggerMethod;
}

export class Logger implements ServerSideLogger {
  internalLogger: winston.Logger;

  constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.internalLogger = developmentLogger;
    } else {
      this.internalLogger = productionLogger;
    }
  }

  info(message: string, metadata?: Metadata, callback?: LogCallback): void {
    this.internalLogger.info(message, metadata, callback);
  }

  debug(message: string, metadata?: Metadata, callback?: LogCallback): void {
    this.internalLogger.debug(message, metadata, callback);
  }

  error(message: string, metadata?: Metadata, callback?: LogCallback): void {
    this.internalLogger.error(message, metadata, callback);
  }

  warn(message: string, metadata?: Metadata, callback?: LogCallback): void {
    this.internalLogger.warn(message, metadata, callback);
  }
}

export default new Logger();
