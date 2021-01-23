import cors, { CorsOptions } from 'cors';
import { RequestHandler, Response, Request } from 'express';
import logger from './logger';

const corsWhitelist = [
  // process.env.APP_DOMAIN instead of the below
  'http://localhost:1337',
  'https://ts-react-node-project-skeleton.herokuapp.com',
];

const buildCorsOptions = (req: Request, res: Response): CorsOptions => ({
  origin(origin, callback): void {
    const handleCorsError = (): void => {
      logger.warn(
        `Request "${req.method} ${req.originalUrl}" from origin ${origin} blocked by CORS policy`,
        { requestBody: JSON.stringify(req.body) }
      );
      res.sendStatus(403);
    };

    if (!corsWhitelist.includes(origin)) {
      return handleCorsError();
    }
    return callback(null, true);
  },
});

/* The "same-origin policy" doesn't apply to request from tools like postman or the browser
console, in which the origin is undefined (i.e., not originating from another URL). This middleware
prevents access from requests with an undefined origin. (Though granted, you can just hardcode
the `Origin` header to one of the whitelist values if you know the whitelist. And it's easy to guess
that the same origin is part of the whitelist.) */
export const corsStrictSameOrigin: RequestHandler = (req, res, next) =>
  cors(buildCorsOptions(req, res))(req, res, next);
