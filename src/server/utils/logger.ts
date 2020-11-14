import { createLogger, format, transports } from 'winston';
import chalk from 'chalk';

const labels: { [index: string]: string } = {
  info: chalk.bgCyan.black(' INFO '),
  debug: chalk.bgMagenta.black(' DEBUG '),
  warn: chalk.bgYellow.black(' WARN '),
  error: chalk.bgRed.black(' ERROR '),
  external: chalk.bgBlueBright.black(' EXTERNAL '),
  perf: chalk.bgGreen.black(' PERF '),
};

const devLoggerColorizer: {
  [index: string]: (logMessage: string) => string;
} = {
  info: (logMessage: string): string => chalk.cyan(logMessage),
  debug: (logMessage: string): string => chalk.magenta(logMessage),
  warn: (logMessage: string): string => chalk.yellow(logMessage),
  error: (logMessage: string): string => chalk.red(logMessage),
  external: (logMessage: string): string => chalk.blueBright(logMessage),
  perf: (logMessage: string): string => chalk.green(logMessage),
};

const developmentFormatter = format.printf(
  (log) =>
    `${labels[log.level]} ${devLoggerColorizer[log.level](log.message)} ${
      chalk.gray(log.timestamp)
    }`
);

const logger = createLogger({
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    perf: 4,
  },
  transports: [
    new transports.Console({
      level: 'perf', // means that this and all levels below it will be logged
      format: format.combine(format.timestamp(), developmentFormatter),
    }),
  ],
});

export default logger;
