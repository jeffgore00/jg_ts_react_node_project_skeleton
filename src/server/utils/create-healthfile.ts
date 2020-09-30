import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

import { version } from '../../../package.json';

const healthLocation = '../health.json';

export default function createHealthfile(): void {
  childProcess.exec(
    'git rev-parse HEAD',
    (err: childProcess.ExecException, stdout: string) => {
      if (err) {
        throw new Error('Error writing healthfile: could not get commit hash');
      } else {
        const health = {
          commit: stdout.replace('\n', ''),
          version,
        };
        fs.writeFileSync(
          path.join(__dirname, healthLocation),
          JSON.stringify(health, null, 2)
        );
      }
    }
  );
}
