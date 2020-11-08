import path from 'path';
import fs from 'fs';

import createHealthfile from './create-healthfile';
import packageJson from '../../../package.json';

/* Scoping this mock call to each `describe` is not possible, for reasons I can't fully explain. */
jest.mock('child_process', () => ({
  exec: (_: string, callback: Function): void => {
    if (process.env.CHILD_PROCESS_MOCK === 'success') {
      callback(null, '9d4b6ec5fcc5400c21970701c670b1ee290e45e2');
    }
    if (process.env.CHILD_PROCESS_MOCK === 'failure') {
      callback(new Error('sample_error'));
    }
  },
}));

describe('Create Healthfile', () => {
  afterAll(() => {
    delete process.env.CHILD_PROCESS_MOCK;
  });

  describe('When the git commit hash is retrieved successfully', () => {
    const healthfilePath = path.join(__dirname, '../health.json');
    let preexistingHealthfileContents: string;

    beforeAll(() => {
      preexistingHealthfileContents = fs.readFileSync(healthfilePath, 'utf-8');
      process.env.CHILD_PROCESS_MOCK = 'success';
    });

    afterAll(() => {
      fs.writeFileSync(healthfilePath, preexistingHealthfileContents);
    });

    it('writes to the healthfile with the repo version and latest commit hash', async () => {
      createHealthfile();
      const fileJson = await import('../health.json').then(
        (module) => module.default
      );
      expect(fileJson).toEqual({
        version: packageJson.version,
        commit: '9d4b6ec5fcc5400c21970701c670b1ee290e45e2',
      });
    });
  });

  describe('When there is an error retrieving the git commit', () => {
    beforeAll(() => {
      process.env.CHILD_PROCESS_MOCK = 'failure';
    });

    it('throws an error', () => {
      expect(() => createHealthfile()).toThrowError(
        'Error writing healthfile: could not get commit hash'
      );
    });
  });
});
