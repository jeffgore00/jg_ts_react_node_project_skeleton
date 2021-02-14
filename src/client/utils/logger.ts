/* eslint-disable class-methods-use-this */
import axios from 'axios';

import { LogTypes, Metadata } from '../../shared/types/logging';

export class Logger {
  // In order to allow logger['info']
  [key: string]: Function;

  internalLogger(
    logType: LogTypes,
    message: string,
    additionalData?: Metadata,
  ): void {
    axios.put('/api/logs', {
      logType,
      logSource: 'UI',
      message,
      ...(additionalData && {
        additionalData,
      }),
    });
  }

  info(message: string, additionalData?: Metadata): void {
    this.internalLogger(LogTypes.Info, message, additionalData);
  }

  debug(message: string, additionalData?: Metadata): void {
    this.internalLogger(LogTypes.Debug, message, additionalData);
  }

  error(message: string, additionalData?: Metadata): void {
    this.internalLogger(LogTypes.Error, message, additionalData);
  }

  warn(message: string, additionalData?: Metadata): void {
    this.internalLogger(LogTypes.Warn, message, additionalData);
  }
}

export default new Logger();
