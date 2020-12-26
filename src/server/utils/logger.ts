/* eslint-disable import/no-extraneous-dependencies */
import winston, {
  createLogger,
  format,
  transports,
  LogCallback,
} from 'winston';
import chalk from 'chalk';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
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

const developmentFormatter = format.printf(
  (log) =>
    `${labels[log.level]} ${devLoggerColorizer[log.level](
      log.message
    )} ${chalk.gray(log.timestamp)}`
);

const developmentLogger = createLogger({
  levels,
  transports: [
    new transports.Console({
      level: 'debug', // means that this and all levels below it will be logged
      format: format.combine(format.timestamp(), developmentFormatter),
    }),
  ],
});

const productionLogger = createLogger({
  levels,
  transports: [
    new transports.Console({
      level: 'info', // means that this and all levels below it will be logged
      format: format.combine(format.timestamp(), format.json()),
    }),
  ],
});

interface Metadata {
  [key: string]: string | number;
}

interface RawParams {
  [key: string]: Function;
}
export class Logger implements RawParams {
  internalLogger: winston.Logger;

  // In order to allow logger['info']
  [key: string]: Function;

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

// export interface Logger extends RawParams {
//   info(message: string, metadata?: any): void
//   debug(message: string, metadata?: any): void
//   error(message: string, metadata?: any): void
//   warn(message: string, metadata?: any): void
// }

export default new Logger();
