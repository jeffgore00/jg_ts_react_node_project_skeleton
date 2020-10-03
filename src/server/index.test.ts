/* eslint-disable global-require, @typescript-eslint/unbound-method */
import http, { Server } from 'http';
import https from 'https';
import app from './app';

jest.mock('./app');

const httpServerMock = {} as http.Server;
const httpsServerMock = {} as https.Server;

httpServerMock.listen = jest.fn();
httpsServerMock.listen = jest.fn();

describe('Server', () => {
  const httpSpy = jest
    .spyOn(http, 'createServer')
    .mockImplementation(jest.fn(() => httpServerMock));
  const httpsSpy = jest
    .spyOn(https, 'createServer')
    .mockImplementation(jest.fn(() => httpsServerMock));

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When the environment is not production', () => {
    beforeEach(() => {
      jest.isolateModules(() => {
        require('.');
      });
    });

    it('creates an HTTP server with the Express application', () => {
      expect(httpSpy).toHaveBeenCalledWith(app);
      expect(httpsSpy).not.toHaveBeenCalled();
    });
  });

  describe('When the environment is production', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
      jest.isolateModules(() => {
        require('.');
      });
    });

    it('creates an HTTPS server with the certificates and the Express application', () => {
      expect(httpsSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          key: expect.any(String),
          cert: expect.any(String),
        }),
        app
      );
      expect(httpSpy).not.toHaveBeenCalled();
    });
  });

  // describe('When process.env.LISTEN_PORT is defined', () => {

  // })

  // describe('When process.env.LISTEN_PORT is not defined', () => {

  // })
});
