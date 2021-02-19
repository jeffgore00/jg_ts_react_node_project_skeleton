/* eslint-disable class-methods-use-this, no-console */
import axios, { AxiosResponse, AxiosError } from 'axios';

import { LogType, Metadata } from '../../shared/types/logging';

export class Logger {
  // In order to allow logger['info']
  [key: string]:
    | string
    | ((message: string, metadata?: Metadata) => void)
    | ((
        logType: LogType,
        message: string,
        additionalData?: Metadata,
      ) => Promise<void>);

  sendLogToServer(
    logType: LogType,
    message: string,
    additionalData?: Metadata,
  ): Promise<void> {
    return axios
      .put('/api/logs', {
        logType,
        logSource: 'UI',
        message,
        ...(additionalData && {
          additionalData,
        }),
      })
      .then((res: AxiosResponse) => {
        if (res.status >= 300) {
          throw new Error(
            `Non-ok response from /api/logs endpoint: ${res.status}`,
          );
        }
      })
      .catch((err: AxiosError) => {
        console.error(
          `Failed to log message: "${message}". Error: ${err.message}`,
        );
      });
  }

  info(message: string, additionalData?: Metadata): Promise<void> {
    return this.sendLogToServer(LogType.Info, message, additionalData);
  }

  debug(message: string, additionalData?: Metadata): Promise<void> {
    return this.sendLogToServer(LogType.Debug, message, additionalData);
  }

  error(message: string, additionalData?: Metadata): Promise<void> {
    return this.sendLogToServer(LogType.Error, message, additionalData);
  }

  warn(message: string, additionalData?: Metadata): Promise<void> {
    return this.sendLogToServer(LogType.Warn, message, additionalData);
  }
}

export default new Logger();
