/* eslint-disable global-require, @typescript-eslint/unbound-method */
/*
 test the default 500 response message when there is no error message
*/
import morgan from 'morgan';
import { Request, Response, ErrorRequestHandler } from 'express';

const req = {} as Request;
const res = {} as Response;
const next = jest.fn();

const resReturnedFromStatus = {} as Response;
resReturnedFromStatus.json = jest.fn();
resReturnedFromStatus.send = jest.fn();

const statusMock = jest.fn(() => resReturnedFromStatus);
res.status = statusMock;

const sendStatusMock = jest.fn();
res.sendStatus = sendStatusMock;

const sendMock = jest.fn();
res.send = sendMock;

const headerMock = jest.fn();
res.header = headerMock;

jest.mock('../client/utils/logger');
jest.mock('morgan', () => jest.fn(() => (): void => {}));

describe('Logging', () => {
  /* This test requires isolated module loading, because the logging
  configuration is executed as soon as the module loads. In other words this
  tests how the app is configured to function, not the functionality itself;
  because the configuration is dynamic it should be tested. */
  const setupTest = (nodeEnv: string): void => {
    let originalProcessEnv: string;

    beforeAll(() => {
      originalProcessEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = nodeEnv;
      jest.isolateModules(() => {
        require('./app');
      });
    });

    afterAll(() => {
      process.env.NODE_ENV = originalProcessEnv;
      jest.clearAllMocks();
    });
  };

  describe('When the environment is development', () => {
    setupTest('development');

    it('uses the "dev" logging mode', () => {
      expect(morgan).toHaveBeenCalledWith('dev');
    });
  });

  describe('When the environment is production', () => {
    setupTest('production');

    it('uses the "short" logging mode', () => {
      expect(morgan).toHaveBeenCalledWith('short');
    });
  });
});

describe('Error handling middleware', () => {
  const errorWithMessage = new Error('sample error');
  const errorWithoutMessage = new Error();

  let sendErrorResponse: ErrorRequestHandler;

  beforeAll(() => {
    /* This function does not depend on isolated loading, but the other middlewares do,
    hence this also needs to be loaded in isolation to avoid polluting the scope of
    other tests. Note that a dynamic import does not solve this problem! */
    jest.isolateModules(() => {
      ({ sendErrorResponse } = require('./app'));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('assigns a 500 status to the response', () => {
    sendErrorResponse(new Error(), req, res, next);
    expect(statusMock).toHaveBeenCalledWith(500);
  });

  describe('when error has a `message` property', () => {
    it('assigns that message to the `error` property of the JSON response', () => {
      sendErrorResponse(errorWithMessage, req, res, next);
      expect(resReturnedFromStatus.json).toHaveBeenCalledWith({
        error: errorWithMessage.message,
      });
    });
  });

  describe('when error does not have a message', () => {
    it('assigns a generic message to the `error` property of the JSON response', () => {
      sendErrorResponse(errorWithoutMessage, req, res, next);
      expect(resReturnedFromStatus.json).toHaveBeenCalledWith({
        error: 'Internal server error.',
      });
    });
  });
});
