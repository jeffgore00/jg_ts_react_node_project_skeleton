import { RequestHandler } from 'express';
import { formatDistanceToNow } from 'date-fns';
import health from '../health.json';

const serverStartTimestamp = new Date();
const uptime = formatDistanceToNow(serverStartTimestamp);

const healthCheckMiddleware: RequestHandler = (req, res, next) => {
  res.json({ ...health, uptime });
};

export default healthCheckMiddleware;
