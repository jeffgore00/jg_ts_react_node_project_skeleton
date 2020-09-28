/*
- test that logging middleware is applied correctly
- test the default 500 response message when there is no error message
*/

import morgan from 'morgan';
import { Request, Response, NextFunction } from 'express';

jest.mock('morgan', () =>
  jest.fn(() => (req: Request, res: Response, next: NextFunction) => {})
);

describe('Logging', () => {
  describe('When the environment is development', () => {
    let originalProcessEnv: string;

    beforeAll(() => {
      originalProcessEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
    });

    afterAll(() => {
      process.env.NODE_ENV = originalProcessEnv;
      jest.resetAllMocks();
    });

    it('works', async () => {
      await import('./app');
      expect(morgan).toHaveBeenCalledWith('dev');
    });
  });

  describe('When the environment is production', () => {
    let originalProcessEnv: string;

    beforeAll(() => {
      originalProcessEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
    });

    afterAll(() => {
      process.env.NODE_ENV = originalProcessEnv;
      jest.resetAllMocks();
    });

    it('uses short', async () => {
      await import('./app');
      expect(morgan).toHaveBeenCalledWith('short');
    });
  });
});
