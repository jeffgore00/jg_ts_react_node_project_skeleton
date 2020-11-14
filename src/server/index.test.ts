/* eslint-disable global-require, @typescript-eslint/unbound-method */
import http from 'http';
import https from 'https';
import app from './app';

jest.mock('./app');

const httpServerMock = {} as http.Server;
const httpsServerMock = {} as https.Server;
const serverListenMock = jest.fn((port, callback: any) => callback());

httpServerMock.listen = serverListenMock;
httpsServerMock.listen = serverListenMock;

describe('Server', () => {
  let consoleSpy: any;

  const httpSpy = jest
    .spyOn(http, 'createServer')
    .mockImplementation(jest.fn(() => httpServerMock));

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
    jest.isolateModules(() => {
      require('.');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates an HTTP server with the Express application', () => {
    expect(httpSpy).toHaveBeenCalledWith(app);
    expect(
      consoleSpy.mock.calls[0][0].includes('HTTP server listening on port')
    ).toBe(true);
  });

  describe('When process.env.PORT is defined', () => {
    beforeAll(() => {
      process.env.PORT = '8080';
    });

    afterAll(() => {
      delete process.env.PORT;
    });

    it('listens on that port', () => {
      expect(httpServerMock.listen).toHaveBeenCalledWith(
        process.env.PORT,
        expect.any(Function)
      );
    });
  });

  describe('When process.env.PORT is not defined', () => {
    beforeAll(() => {
      delete process.env.PORT;
    });

    it('listens on port 3000', () => {
      expect(httpServerMock.listen).toHaveBeenCalledWith(
        '3000',
        expect.any(Function)
      );
    });
  });
});
