/* eslint-disable no-console, global-require, @typescript-eslint/no-unused-expressions,
@typescript-eslint/no-unsafe-assignment */

import * as getServerStatusModule from './get-server-status';

const sampleError = new Error('write failure');

interface Constants {
  [key: string]: string;
}

describe('Edit server status file', () => {
  let getServerStatusSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let module: Constants;

  beforeAll(() => {
    getServerStatusSpy = jest
      .spyOn(getServerStatusModule, 'getServerStatus')
      .mockImplementation(() => ({
        commit: 'unknown',
        version: '1.0.0',
      }));
    consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => null);
    jest.isolateModules(() => {
      module = require('./edit-server-status-file');
    });
  });

  it('works', () => {});

  // it('calls editHealthfile with the distributon path', () => {
  //   expect(getServerStatusSpy).toHaveBeenCalledWith(
  //     module.PATH_TO_DIST_HEALTHFILE,
  //   );
  // });

  // describe('when theres an error', () => {
  //   it('calls editHealthfile with the distributon path', () => {
  //     expect(consoleErrorSpy).toHaveBeenCalledWith(
  //       `${module.HEALTHFILE_EDIT_ERROR_MESSAGE}${sampleError}`,
  //     );
  //   });
  // });
});
