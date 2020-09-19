import { Router, RequestHandler } from 'express';
import { formatDistanceToNow } from 'date-fns';
import childProcess from 'child_process';

import { version } from '../../../package.json';

const router = Router();
const serverStartTimestamp = new Date();

const healthCheckResponse: RequestHandler = (req, res, next) => {
  childProcess.exec(
    'git rev-parse HEAD',
    (err: childProcess.ExecException, stdout: string) => {
      if (err) {
        next(err);
      } else {
        res.json({
          commit: stdout.replace('\n', ''),
          version,
          uptime: formatDistanceToNow(serverStartTimestamp),
        });
      }
    }
  );
};

router.get('/health', healthCheckResponse);

export default router;
