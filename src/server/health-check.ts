/* eslint-disable no-console */
import editHealthfile from './utils/edit-healthfile';

/*
As part of a production build, we want to alter the file in `dist`, not in `src`.
This file is intended for use as an npm script argument e.g.

tsc --project tsconfig.server.json && node -r ts-node/register src/server/utils/edit-healthfile.ts
*/
if (process.env.NODE_ENV === 'production') {
  try {
    editHealthfile('../../../dist/server/health.json');
  } catch (err) {
    console.error(`Health file edit failed: ${err}`);
  }
}
