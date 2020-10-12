/* eslint-disable global-require */
/*
 test the default 500 response message when there is no error message
*/
import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

const req = {} as Request;
const res = {} as Response;
const next = jest.fn();

const resReturnedFromStatus = {} as Response;
resReturnedFromStatus.json = jest.fn();
resReturnedFromStatus.send = jest.fn();

const statusMock = jest.fn(() => resReturnedFromStatus);
res.status = statusMock;

const sendFileMock = jest.fn();
res.sendFile = sendFileMock;

jest.mock('morgan', () =>
  jest.fn(
    () => (
      request: Request,
      response: Response,
      nextFunc: NextFunction
    ): void => {}
  )
);

describe('Logging', () => {
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

  let sendErrorResponse: any;

  beforeAll(async () => {
    // need to do this to allow other dynamic require tests above to succeed
    ({ sendErrorResponse } = await import('./app'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('assigns a 500 status to the response', () => {
    sendErrorResponse(new Error(), req, res, next);
    expect(statusMock).toHaveBeenCalledWith(500);
  });

  describe('when error has a message', () => {
    it('does the right thing', () => {
      sendErrorResponse(errorWithMessage, req, res, next);
      expect(resReturnedFromStatus.json).toHaveBeenCalledWith({
        error: errorWithMessage.message,
      });
    });
  });

  describe('when error does not have a message', () => {
    it('does the right thing', () => {
      sendErrorResponse(errorWithoutMessage, req, res, next);
      expect(resReturnedFromStatus.json).toHaveBeenCalledWith({
        error: 'Internal server error.',
      });
    });
  });
});

describe('Send homepage callback', () => {
  let sendHomepage: any;

  beforeAll(async () => {
    // need to do this to allow other dynamic require tests above to succeed
    ({ sendHomepage } = await import('./app'));
  });

  describe('When there is no error', () => {
    beforeAll(() => {
      sendFileMock.mockImplementation((filePath, options, errback) => {
        errback();
      });
    });

    it('works', () => {
      sendHomepage(req, res);
      expect(statusMock).not.toHaveBeenCalled();
    });
  });

  describe('When there is an error', () => {
    beforeAll(() => {
      sendFileMock.mockImplementation((filePath, options, errback) => {
        errback(new Error());
      });
    });

    it('works', () => {
      sendHomepage(req, res);
      expect(statusMock).toHaveBeenCalledWith(404);
    });
  });
});
