import path from 'path';
import fs from 'fs';

import createHealthfile from './create-healthfile';
import packageJson from '../../../package.json';

jest.mock('./logger', () => ({
  info: jest.fn(),
}));

describe('Create Healthfile', () => {
  const healthfilePath = path.join(__dirname, '../health.json');
  let preexistingHealthfileContents: string;

  describe('When process.env.SOURCE_VERSION is defined', () => {
    const sampleCommitHash = 'daa20e9175eb078889604272046bd0ff077dbfc3';

    beforeAll(() => {
      preexistingHealthfileContents = fs.readFileSync(healthfilePath, 'utf-8');
      process.env.SOURCE_VERSION = 'daa20e9175eb078889604272046bd0ff077dbfc3';
    });

    afterAll(() => {
      fs.writeFileSync(healthfilePath, preexistingHealthfileContents);
      delete process.env.SOURCE_VERSION;
    });

    it('writes to the healthfile with the repo version and the value of that env variable (which should be a commit hash)', async () => {
      createHealthfile();
      const fileJson = await import('../health.json').then(
        (module) => module.default
      );
      expect(fileJson).toEqual({
        version: packageJson.version,
        commit: sampleCommitHash,
      });
    });
  });

  describe('When process.env.SOURCE_VERSION is not defined', () => {
    it('fails', () => {
      throw new Error('write this test');
    });
  });
});
