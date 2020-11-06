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
  let originalNodeEnv: string;
  let consoleSpy: any;

  const httpSpy = jest
    .spyOn(http, 'createServer')
    .mockImplementation(jest.fn(() => httpServerMock));
  const httpsSpy = jest
    .spyOn(https, 'createServer')
    .mockImplementation(jest.fn(() => httpsServerMock));

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When the environment is not production', () => {
    beforeAll(() => {
      originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
    });

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
      jest.isolateModules(() => {
        require('.');
      });
    });

    afterAll(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('creates an HTTP server with the Express application', () => {
      expect(httpSpy).toHaveBeenCalledWith(app);
      expect(httpsSpy).not.toHaveBeenCalled();
      expect(
        consoleSpy.mock.calls[0][0].includes('HTTP server listening on port')
      ).toBe(true);
    });
  });

  // describe('When the environment is production', () => {
  //   beforeAll(() => {
  //     originalNodeEnv = process.env.NODE_ENV;
  //     process.env.NODE_ENV = 'production';
  //   });

  //   beforeEach(() => {
  //     consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
  //     jest.isolateModules(() => {
  //       require('.');
  //     });
  //   });

  //   afterAll(() => {
  //     process.env.NODE_ENV = originalNodeEnv;
  //   });

  //   it('creates an HTTPS server with the certificates and the Express application', () => {
  //     expect(httpsSpy).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         key: expect.any(String),
  //         cert: expect.any(String),
  //       }),
  //       app
  //     );
  //     expect(httpSpy).not.toHaveBeenCalled();
  //   });
  // });

  describe('When process.env.LISTEN_PORT is defined', () => {
    beforeAll(() => {
      process.env.LISTEN_PORT = '8080';
    });

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
      jest.isolateModules(() => {
        require('.');
      });
    });

    afterAll(() => {
      delete process.env.LISTEN_PORT;
    });

    it('listens on that port', () => {
      expect(httpServerMock.listen).toHaveBeenCalledWith(
        process.env.LISTEN_PORT,
        expect.any(Function)
      );
    });
  });

  describe('When process.env.LISTEN_PORT is not defined', () => {
    beforeAll(() => {
      delete process.env.LISTEN_PORT;
    });

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());
      jest.isolateModules(() => {
        require('.');
      });
    });

    it('listens on port 3000', () => {
      expect(httpServerMock.listen).toHaveBeenCalledWith(
        '3000',
        expect.any(Function)
      );
    });
  });
});
