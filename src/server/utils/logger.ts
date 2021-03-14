import winston, { LogCallback } from 'winston';
import { Metadata } from '../../shared/types/logging';

import { developmentLogger } from './logger-dev';
import { productionLogger } from './logger-prod';

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
