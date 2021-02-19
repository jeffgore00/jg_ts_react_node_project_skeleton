/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';

import { Logger } from './logger';
import { LogType } from '../../shared/types/logging';

describe('Logger', () => {
  let logger: Logger;
  let axiosPutSpy: jest.SpyInstance;

  const SAMPLE_MESSAGE = 'sample message';

  beforeAll(() => {
    axiosPutSpy = jest
      .spyOn(axios, 'put')
      .mockImplementation(() => Promise.resolve({ status: 200 }));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // eslint-disable-next-line jest/expect-expect
  it('exposes the logging methods info, error, warn, debug', () => {
    // Just to demonstrate it is callable
    logger = new Logger();
    Object.values(LogType).forEach((logType) => {
      void logger[logType]('hi');
    });
  });

  describe('when called, each of those methods...', () => {
    it.each(Object.values(LogType).map((type) => [type]))(
      'issues a PUT request to the /api/logs endpoint with logType: %s',
      (logType) => {
        void logger[logType](SAMPLE_MESSAGE);
        expect(axiosPutSpy).toHaveBeenCalledWith('/api/logs', {
          logType,
          logSource: 'UI',
          message: SAMPLE_MESSAGE,
        });
      },
    );

    describe('When the optional `additionalData` argument is provided', () => {
      it.each(Object.values(LogType).map((type) => [type]))(
        'issues a PUT request to the /api/logs endpoint plus `additionalData`',
        (logType) => {
          void logger[logType](SAMPLE_MESSAGE, { clientId: 12345 });
          expect(axiosPutSpy).toHaveBeenCalledWith('/api/logs', {
            logType,
            logSource: 'UI',
            message: SAMPLE_MESSAGE,
            additionalData: { clientId: 12345 },
          });
        },
      );
    });

    describe('When the call to the /api/logs endpoint is not successful', () => {
      let consoleSpy: jest.SpyInstance;
      beforeAll(() => {
        consoleSpy = jest
          .spyOn(console, 'error')
          .mockImplementation(() => null);
      });

      describe('When the call to the /api/logs endpoint responds with non 200-level response', () => {
        beforeAll(() => {
          axiosPutSpy = jest
            .spyOn(axios, 'put')
            .mockImplementation(() => Promise.resolve({ status: 401 }));
        });

        const SAMPLE_LOG_MESSAGE = 'SAMPLE_LOG_MESSAGE';

        it('Logs the error to the console', async () => {
          await logger.info(SAMPLE_LOG_MESSAGE);
          expect(consoleSpy).toHaveBeenCalledWith(
            `Failed to log message: "${SAMPLE_LOG_MESSAGE}". Error: Non-ok response from /api/logs endpoint: 401`,
          );
        });
      });

      describe('When the call to the /api/logs endpoint fails', () => {
        beforeAll(() => {
          axiosPutSpy = jest
            .spyOn(axios, 'put')
            .mockImplementation(() =>
              Promise.reject(new Error('ECONNREFUSED')),
            );
        });

        const SAMPLE_LOG_MESSAGE = 'SAMPLE_LOG_MESSAGE';

        it('Logs the error to the console', async () => {
          await logger.info(SAMPLE_LOG_MESSAGE);
          expect(consoleSpy).toHaveBeenCalledWith(
            `Failed to log message: "${SAMPLE_LOG_MESSAGE}". Error: ECONNREFUSED`,
          );
        });
      });
    });
  });
});
