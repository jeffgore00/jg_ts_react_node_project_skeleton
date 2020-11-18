import fs from 'fs';
import path from 'path';

import { version } from '../../../package.json';
import logger from "./logger";

const healthLocation = '../health.json';

/* Exported for unit testing, but true intended usage is in invocation at bottom. */
export default function createHealthfile(
  healthLocationOverride?: string
): void {
  const relativePathToHealthfile = healthLocationOverride || healthLocation;

  /* SOURCE_VERSION appears to be a Heroku-specific environment variable. A previous iteration had
  an `else` clause that ran a Node process to run 'git rev-parse HEAD', but that became very
  difficult to test, since mocking the child process also interfered with setting env variables. */
  if (process.env.SOURCE_VERSION) {
    const health = {
      commit: process.env.SOURCE_VERSION,
      version,
    };
    fs.writeFileSync(
      path.join(__dirname, relativePathToHealthfile),
      JSON.stringify(health, null, 2)
    );
  } else {
    logger.info(
      'Failed to get commit hash - process.env.SOURCE_VERSION not defined'
    );
  }
}

/*
As part of a production build, we want to alter the file in `dist`, not in `src`.
This file is intended for use as an npm script argument e.g.

tsc --project tsconfig.server.json && node -r ts-node/register src/server/utils/create-healthfile.ts
*/
createHealthfile('../../../dist/server/health.json');
