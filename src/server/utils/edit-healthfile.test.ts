/* eslint-disable global-require, @typescript-eslint/unbound-method,
@typescript-eslint/no-unsafe-assignment */

import path from 'path';
import fs from 'fs';

import { editHealthfile, logs } from './edit-healthfile';
import packageJson from '../../../package.json';
import logger from './logger';

jest.mock('./logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// TODO: test file writing. Previously did, but upgrade to TS4 or new Jest broke
// this test. Even though using sync methods, Jest appears to be caching the .json
// file.
describe('Create Healthfile', () => {
  const healthfilePath = path.join(__dirname, '../health.json');
  let preexistingHealthfileContents: string;

  beforeAll(() => {
    preexistingHealthfileContents = fs.readFileSync(healthfilePath, 'utf-8');
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    fs.writeFileSync(healthfilePath, preexistingHealthfileContents);
  });

  describe('When process.env.SOURCE_VERSION is defined', () => {
    const sampleCommitHash = 'daa20e9175eb078889604272046bd0ff077dbfc3';

    beforeAll(() => {
      process.env.SOURCE_VERSION = sampleCommitHash;
    });

    afterAll(() => {
      delete process.env.SOURCE_VERSION;
    });

    it('adds to the healthfile JSON the "commit" key, the value of that env variable (which should be a commit hash)', () => {
      expect(editHealthfile()).toEqual({
        version: packageJson.version,
        commit: sampleCommitHash,
      });
    });
  });

  describe('When process.env.SOURCE_VERSION is not defined', () => {
    beforeAll(() => {
      delete process.env.SOURCE_VERSION;
    });
    it('writes to the healthfile a JSON object with the repo version', () => {
      expect(editHealthfile()).toEqual({
        version: packageJson.version,
        commit: 'unknown',
      });
    });

    it('logs the inability to get the commit ', () => {
      editHealthfile();
      expect(logger.info).toHaveBeenCalledWith(logs.FAILED_TO_GET_COMMIT_HASH);
    });
  });
});
