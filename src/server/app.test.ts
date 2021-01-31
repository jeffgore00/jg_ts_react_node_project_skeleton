/* eslint-disable global-require */
/*
 test the default 500 response message when there is no error message
*/
import morgan from 'morgan';
import {
  Request,
  Response,
  ErrorRequestHandler,
  RequestHandler,
} from 'express';

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

  beforeAll(async () => {
    /* The function needs to be loaded dynamically in order to allow other tests
    in this file to work, since they depend on isolated loading. */
    ({ sendErrorResponse } = await import('./app'));
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

// describe('Send Homepage middleware', () => {
//   let sendHomepage: RequestHandler;

//   beforeAll(async () => {
//     // need to do this to allow other dynamic require tests above to succeed
//     ({ sendHomepage } = await import('./app'));
//     sendFileMock.mockImplementation((filePath, options, errback) => {
//       errback();
//     });
//   });

//   it('Calls `res.sendFile` with the index.html file', () => {
//     sendHomepage(req, res, null);
//     expect(sendFileMock.mock.calls[0][0]).toContain('public/index.html');
//   });

//   describe('When `res.sendFile` does not result in error', () => {
//     beforeAll(() => {
//       sendFileMock.mockImplementation((filePath, options, errback) => {
//         errback();
//       });
//     });

//     it('does nothing', () => {
//       sendHomepage(req, res, null);
//       expect(statusMock).not.toHaveBeenCalled();
//       expect(resReturnedFromStatus.send).not.toHaveBeenCalled();
//     });
//   });

//   describe('When `res.sendFile` results in an error which prevents a response', () => {
//     beforeAll(() => {
//       sendFileMock.mockImplementation((filePath, options, errback) => {
//         errback(new Error());
//       });
//     });

//     it('Sends a text error response with a 404 status code', () => {
//       sendHomepage(req, res, null);
//       expect(statusMock).toHaveBeenCalledWith(404);
//       expect(resReturnedFromStatus.send).toHaveBeenCalledWith(
//         'Main HTML file not found!'
//       );
//     });
//   });
// });
