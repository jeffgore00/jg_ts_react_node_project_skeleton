/* eslint-disable global-require, @typescript-eslint/no-unsafe-assignment */
import { Request, RequestHandler, Response } from 'express';

import * as configExport from '../config';
import logger from '../utils/logger';

describe('CORS Strict same origin', () => {
  let corsStrictSameOrigin: RequestHandler;
  let req: Partial<Request>;
  const res: Partial<Response> = {
    sendStatus: jest.fn(),
    getHeader: jest.fn(), // for cors middleware, will throw error without this
    setHeader: jest.fn(), // for cors middleware, will throw error without this
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('When the origin is in the whitelist', () => {
    beforeAll(() => {
      req = {
        body: 'good intent',
        method: 'POST',
        originalUrl: 'https://www.app-that-uses-this-boilerplate.com/api/users',
        headers: { origin: 'http://goodintentions.com' },
      };
      jest.spyOn(configExport, 'getConfig').mockImplementation(() => ({
        corsWhitelist: ['http://goodintentions.com'],
      }));
      jest.isolateModules(() => {
        ({ corsStrictSameOrigin } = require('./cors'));
      });
    });

    it('calls `next`', () => {
      corsStrictSameOrigin(req as Request, res as Response, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('When the origin is not in the whitelist', () => {
    beforeAll(() => {
      req = {
        body: 'neutral intent',
        method: 'POST',
        originalUrl: 'https://www.app-that-uses-this-boilerplate.com/api/users',
        headers: { origin: 'http://neutralintentions.com' },
      };
    });

    describe('When the whitelist contains "*"', () => {
      beforeAll(() => {
        jest.spyOn(configExport, 'getConfig').mockImplementation(() => ({
          corsWhitelist: ['http://goodintentions.com', '*'],
        }));
        jest.isolateModules(() => {
          ({ corsStrictSameOrigin } = require('./cors'));
        });
      });

      it('calls `next`', () => {
        corsStrictSameOrigin(req as Request, res as Response, next);
        expect(next).toHaveBeenCalled();
      });
    });

    describe('When the whitelist does not contain "*"', () => {
      let loggerSpy: jest.SpyInstance;

      beforeAll(() => {
        jest.spyOn(configExport, 'getConfig').mockImplementation(() => ({
          corsWhitelist: ['http://goodintentions.com'],
        }));
        loggerSpy = jest.spyOn(logger, 'warn').mockImplementation(() => null);
        jest.isolateModules(() => {
          ({ corsStrictSameOrigin } = require('./cors'));
        });
      });

      it('sends a 403 response and logs the occurrence', () => {
        corsStrictSameOrigin(req as Request, res as Response, next);
        expect(next).not.toHaveBeenCalled();
        expect(res.sendStatus).toHaveBeenCalledWith(403);
        expect(
          loggerSpy,
        ).toHaveBeenCalledWith(
          'Request "POST https://www.app-that-uses-this-boilerplate.com/api/users" from origin http://neutralintentions.com blocked by CORS policy',
          { requestBody: JSON.stringify(req.body) },
        );
      });
    });
  });
});
