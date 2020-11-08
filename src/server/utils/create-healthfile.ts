import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

import { version } from '../../../package.json';

const healthLocation = '../health.json';

export default function createHealthfile(
  healthLocationOverride?: string
): void {
  childProcess.exec(
    'git rev-parse HEAD',
    (err: childProcess.ExecException, stdout: string) => {
      if (err) {
        throw new Error(
          `Error writing healthfile: could not get commit hash, error: ${err}`
        );
      } else {
        const health = {
          commit: stdout.replace('\n', ''),
          version,
        };
        const relativePathToHealthfile =
          healthLocationOverride || healthLocation;
        fs.writeFileSync(
          path.join(__dirname, relativePathToHealthfile),
          JSON.stringify(health, null, 2)
        );
      }
    }
  );
}

createHealthfile('../../../dist/server/health.json');
