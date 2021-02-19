/* eslint-disable import/no-extraneous-dependencies */
import winston, {
  createLogger,
  format,
  transports,
  LogCallback,
} from 'winston';
import chalk from 'chalk';

import { LogType, Metadata } from '../../shared/types/logging';

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
      format: format.combine(format.timestamp(), developmentFormatter),
    }),
  ],
});

const productionLogger = createLogger({
  levels: LogLevels,
  transports: [
    new transports.Console({
      level: 'info', // means that this and all levels below it will be logged
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

export class Logger {
  internalLogger: winston.Logger;

  // In order to allow logger['info']
  [key: string]: any;

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
