/* eslint-disable global-require, @typescript-eslint/unbound-method */
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

describe('Create Healthfile', () => {
  const healthfilePath = path.join(__dirname, '../health.json');
  let preexistingHealthfileContents: string;
  let fileJson: { version: string; commit: string };

  beforeEach(() => {
    preexistingHealthfileContents = fs.readFileSync(healthfilePath, 'utf-8');
    jest.resetAllMocks();
    editHealthfile();
    jest.isolateModules(() => {
      fileJson = require('../health.json');
    });
  });

  afterEach(() => {
    fs.writeFileSync(healthfilePath, preexistingHealthfileContents);
  });

  it('writes to the healthfile a JSON object with the repo version', () => {
    expect(fileJson).toEqual(
      expect.objectContaining({
        version: packageJson.version,
      }),
    );
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
      expect(fileJson).toEqual({
        version: packageJson.version,
        commit: sampleCommitHash,
      });
    });
  });

  describe('When process.env.SOURCE_VERSION is not defined', () => {
    beforeAll(() => {
      delete process.env.SOURCE_VERSION;
    });

    it('logs the inability to get the commit ', () => {
      expect(logger.info).toHaveBeenCalledWith(logs.FAILED_TO_GET_COMMIT_HASH);
    });
  });
});
