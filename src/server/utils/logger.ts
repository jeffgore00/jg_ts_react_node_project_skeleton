import winston, { createLogger, format, transports } from 'winston';
import chalk from 'chalk';

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
  perf: 4,
};

const labels: { [index: string]: string } = {
  info: chalk.bgCyan.black(' INFO '),
  debug: chalk.bgMagenta.black(' DEBUG '),
  warn: chalk.bgYellow.black(' WARN '),
  error: chalk.bgRed.black(' ERROR '),
  perf: chalk.bgGreen.black(' PERF '),
};

const devLoggerColorizer: {
  [index: string]: (logMessage: string) => string;
} = {
  info: (logMessage: string): string => chalk.cyan(logMessage),
  debug: (logMessage: string): string => chalk.magenta(logMessage),
  warn: (logMessage: string): string => chalk.yellow(logMessage),
  error: (logMessage: string): string => chalk.red(logMessage),
  perf: (logMessage: string): string => chalk.green(logMessage),
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
      level: 'perf', // means that this and all levels below it will be logged
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

class Logger {
  internalLogger: winston.Logger;

  constructor() {
    if (process.env.NODE_ENV === 'development') {
      this.internalLogger = developmentLogger;
    } else {
      this.internalLogger = productionLogger;
    }
  }

  info(message: string, metadata?: any): void {
    this.internalLogger.info(message, metadata);
  }
}

export default new Logger();
