import fs from 'fs';
import path from 'path';

import { version } from '../../../package.json';
import logger from './logger';

const healthLocation = '../health.json';

export const logs = {
  FAILED_TO_GET_COMMIT_HASH:
    'Failed to get commit hash for health file creation - process.env.SOURCE_VERSION not defined',
};

/* Exported for unit testing, but true intended usage is in invocation at bottom. */
export default function createHealthfile(
  healthLocationOverride?: string
): void {
  const relativePathToHealthfile = healthLocationOverride || healthLocation;
  const health = {
    version,
    commit: 'unknown',
  };
  /* SOURCE_VERSION appears to be a Heroku-specific environment variable. A previous iteration had
  an `else` clause that ran a Node process to run 'git rev-parse HEAD', but that became very
  difficult to test, since mocking the child process also interfered with setting env variables. */
  if (process.env.SOURCE_VERSION) {
    health.commit = process.env.SOURCE_VERSION;
  } else {
    logger.info(logs.FAILED_TO_GET_COMMIT_HASH);
  }
  fs.writeFileSync(
    path.join(__dirname, relativePathToHealthfile),
    JSON.stringify(health, null, 2)
  );
}

/*
As part of a production build, we want to alter the file in `dist`, not in `src`.
This file is intended for use as an npm script argument e.g.

tsc --project tsconfig.server.json && node -r ts-node/register src/server/utils/create-healthfile.ts
*/
if (process.env.NODE_ENV !== 'test') {
  try {
    createHealthfile('../../../dist/server/health.json');
  } catch (err) {
    console.error(`Health file creation failed: ${err}`);
  }
}
