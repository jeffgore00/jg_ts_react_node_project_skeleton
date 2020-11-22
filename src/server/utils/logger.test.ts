/* eslint-disable global-require, @typescript-eslint/ban-ts-ignore, no-underscore-dangle,
no-useless-escape, no-console */

// import { Logger } from './logger'

describe('Logger', () => {
  let logger: any; // Logger
  let consoleSpy: jest.SpyInstance;
  const SAMPLE_MESSAGE = 'sample message';
  const logLevels = ['info', 'debug', 'warn', 'error'];

  beforeAll(() => {
    consoleSpy = jest
      // @ts-ignore
      .spyOn(console._stdout, 'write')
      .mockImplementation(() => null);
    jest.isolateModules(() => {
      logger = require('./logger').default;
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  // ISO datetime i.e '2020-11-21T22:37:51.226Z'
  // https://stackoverflow.com/questions/3143070/javascript-regex-iso-datetime
  const dateRegexString = `\\d{4}-[01]\\d-[0-3]\\dT[0-2]\\d:[0-5]\\d:[0-5]\\d\\.\\d+([+-][0-2]\\d:[0-5]\\d|Z)`;

  it('exposes the logging methods info, error, warn, debug', () => {
    // Just to demonstrate it is 1) callable and 2) returns nothing, side effects only:
    logLevels.forEach((logLevel) => {
      logger[logLevel]('hi');
      const result = logger.info(SAMPLE_MESSAGE);

      expect(result).toEqual(undefined);
    });
  });

  describe('When the environment is development', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development';
      jest.isolateModules(() => {
        logger = require('./logger').default;
      });
    });

    const createTestRegex = (
      color: string,
      logLevel: string,
      logMessage: string
    ): RegExp => {
      const regexStr = `<black text with ${color} background> ${logLevel.toUpperCase()} <\\/black text with ${color} background> <${color} text>${logMessage}<\\/${color} text> <gray text>${dateRegexString}<\\/gray text>\\n`;
      return new RegExp(regexStr);
    };

    it('logs `info` logs in cyan with a grey timestamp', () => {
      const logMessage = 'THIS IS AN INFO LOG';
      logger.info(logMessage);
      const regex = createTestRegex('cyan', 'info', logMessage);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(regex));
    });

    it('logs `debug` logs in magenta with a grey timestamp', () => {
      const logMessage = 'THIS IS A DEBUG LOG';
      logger.debug(logMessage);
      const regex = createTestRegex('magenta', 'debug', logMessage);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(regex));
    });

    it('logs `warn` logs in yellow with a grey timestamp', () => {
      const logMessage = 'THIS IS A WARN LOG';
      logger.warn(logMessage);
      const regex = createTestRegex('yellow', 'warn', logMessage);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(regex));
    });

    it('logs `error` logs in red with a grey timestamp', () => {
      const logMessage = 'THIS IS AN ERROR LOG';
      logger.error(logMessage);
      const regex = createTestRegex('red', 'error', logMessage);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(regex));
    });
  });

  describe('When the environment is not development', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'production';
      jest.isolateModules(() => {
        logger = require('./logger').default;
      });
    });

    describe('When the log level is not debug', () => {
      it('logs in plain JSON the log, log level, and timestamp', () => {
        logLevels
          .filter((level) => level !== 'debug')
          .forEach((logLevel, index) => {
            logger[logLevel]('hi');

            expect(JSON.parse(consoleSpy.mock.calls[index][0])).toEqual({
              level: logLevel,
              message: 'hi',
              timestamp: expect.stringMatching(new RegExp(dateRegexString)),
            });
          });
      });
    });

    describe('When the log level is debug', () => {
      it('does not log anything to the console', () => {
        logger.debug('hi');
        expect(consoleSpy).not.toHaveBeenCalled();
      });
    });
  });
});
