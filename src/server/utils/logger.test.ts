/* eslint-disable global-require, @typescript-eslint/ban-ts-ignore, no-underscore-dangle */
describe('Logger', () => {
  let logger: any;
  let consoleSpy: any;
  const SAMPLE_MESSAGE = 'sample message';

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

  it('exposes the logging methods info, error, warn, debug', () => {
    // Just to demonstrate it is 1) callable and 2) returns nothing, side effects only:
    let result;
    result = logger.info(SAMPLE_MESSAGE);
    expect(result).toEqual(undefined);

    result = logger.debug(SAMPLE_MESSAGE);
    expect(result).toEqual(undefined);

    result = logger.warn(SAMPLE_MESSAGE);
    expect(result).toEqual(undefined);

    result = logger.error(SAMPLE_MESSAGE);
    expect(result).toEqual(undefined);
  });

  describe('When the environment is development', () => {
    beforeAll(() => {
      process.env.NODE_ENV = 'development';
      jest.isolateModules(() => {
        logger = require('./logger').default;
      });
    });

    // it('logs like so', () => {
    //   logger.info('HELLO');
    //   // console.log('HELLO')
    //   expect(consoleSpy).toHaveBeenCalledWith(' INFO  HELLO 2020-11-21T21:18:17.241Z')
    // });
  });
});
