/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios';

import { Logger } from './logger';
import { LogTypes } from '../../shared/types/logging';

describe('Logger', () => {
  let logger: Logger;
  let axiosPutSpy: jest.SpyInstance;
  const SAMPLE_MESSAGE = 'sample message';

  beforeAll(() => {
    axiosPutSpy = jest
      .spyOn(axios, 'put')
      .mockImplementation(() => Promise.resolve());
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes the logging methods info, error, warn, debug', () => {
    // Just to demonstrate it is 1) callable and 2) returns nothing, side effects only:
    logger = new Logger();
    Object.values(LogTypes).forEach((logType) => {
      const result = logger[logType]('hi');

      expect(result).toEqual(undefined);
    });
  });

  describe('when called, each of those methods...', () => {
    it.each(Object.values(LogTypes).map((type) => [type]))(
      'issues a PUT request to the /api/logs endpoint with logType: %s',
      (logType) => {
        logger[logType](SAMPLE_MESSAGE);
        expect(axiosPutSpy).toHaveBeenCalledWith('/api/logs', {
          logType,
          logSource: 'UI',
          message: SAMPLE_MESSAGE,
        });
      },
    );

    describe('When the optional `additionalData` argument is provided', () => {
      it.each(Object.values(LogTypes).map((type) => [type]))(
        'issues a PUT request to the /api/logs endpoint plus `additionalData`',
        (logType) => {
          logger[logType](SAMPLE_MESSAGE, { clientId: 12345 });
          expect(axiosPutSpy).toHaveBeenCalledWith('/api/logs', {
            logType,
            logSource: 'UI',
            message: SAMPLE_MESSAGE,
            additionalData: { clientId: 12345 },
          });
        },
      );
    });
  });
});
