/* eslint-disable no-console */
import { editHealthfile } from './utils/edit-healthfile';

export const PATH_TO_DIST_HEALTHFILE = '../../dist/server/health.json';
export const HEALTHFILE_EDIT_ERROR_MESSAGE = 'Health file edit failed: ';
/*
As part of a production build, we want to alter the file in `dist`, not in `src`.
This file is intended for use as an npm script argument e.g.

tsc --project tsconfig.server.json && node -r ts-node/register src/server/utils/edit-healthfile.ts
*/
try {
  editHealthfile(PATH_TO_DIST_HEALTHFILE);
} catch (err) {
  console.error(`${HEALTHFILE_EDIT_ERROR_MESSAGE}${err}`);
}
