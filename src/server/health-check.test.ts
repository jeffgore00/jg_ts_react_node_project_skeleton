/* eslint-disable no-console, global-require, @typescript-eslint/no-unused-expressions */
import * as editHealthfileModule from './utils/edit-healthfile';

const sampleError = new Error('write failure');

interface Constants {
  [key: string]: string;
}

describe('Health check', () => {
  let editHealthfileSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let module: Constants;

  beforeAll(() => {
    editHealthfileSpy = jest
      .spyOn(editHealthfileModule, 'editHealthfile')
      .mockImplementation(() => {
        throw sampleError;
      });
    consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => null);
    jest.isolateModules(() => {
      module = require('./health-check');
    });
  });

  it('calls editHealthfile with the distributon path', () => {
    expect(editHealthfileSpy).toHaveBeenCalledWith(
      module.PATH_TO_DIST_HEALTHFILE
    );
  });

  describe('when theres an error', () => {
    it('calls editHealthfile with the distributon path', () => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        `${module.HEALTHFILE_EDIT_ERROR_MESSAGE}${sampleError}`
      );
    });
  });
});
