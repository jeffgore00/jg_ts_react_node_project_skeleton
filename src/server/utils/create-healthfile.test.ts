import createHealthfile from './create-healthfile';

const regexSemver = /^((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/gm;
const regexSHA1 = /\b[0-9a-f]{40}\b/;

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
    beforeAll(() => {
      process.env.CHILD_PROCESS_MOCK = 'success';
    });

    it('writes to the healthfile with the repo version and latest commit hash', async () => {
      createHealthfile();
      const fileJson = await import('../health.json');
      expect(fileJson).toEqual(
        expect.objectContaining({
          version: expect.stringMatching(regexSemver),
          commit: expect.stringMatching(regexSHA1),
        })
      );
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
