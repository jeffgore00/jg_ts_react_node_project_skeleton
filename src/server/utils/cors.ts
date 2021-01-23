import cors, { CorsOptions } from 'cors';

const corsWhitelist = [
  'http://localhost:1337',
  'https://ts-react-node-project-skeleton.herokuapp.com',
];

const buildCorsOptions = (nullOriginAllowed: boolean): CorsOptions => ({
  origin(origin, callback): void {
    if (origin) {
      if (!corsWhitelist.includes(origin)) {
        callback(new Error('Request origin forbidden by CORS policy'));
      } else {
        callback(null, true);
      }
      return;
    }
    if (!nullOriginAllowed) {
      callback(new Error('Request origin forbidden by CORS policy'));
      return;
    }
    callback(null, true);
  },
});

export const corsAllowNullOrigin = cors(buildCorsOptions(true));
export const corsStrictSameOrigin = cors(buildCorsOptions(false));
