import request from 'supertest';

import app from '../src/server/app';
// import childProcess from 'child_process';

const regexSHA1 = /\b[0-9a-f]{40}\b/;

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

describe('GET /api/health-check', () => {
  afterAll(() => {
    delete process.env.CHILD_PROCESS_MOCK;
  });

  describe('When the git commit hash is retrieved successfully', () => {
    beforeAll(() => {
      process.env.CHILD_PROCESS_MOCK = 'success';
    });

    it('responds with the server uptime, repo version, and latest commit hash', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          version: expect.any(String),
          uptime: expect.any(String),
          commit: expect.stringMatching(regexSHA1),
        })
      );
    });
  });

  describe('When there is an error retrieving the git commit', () => {
    beforeAll(() => {
      process.env.CHILD_PROCESS_MOCK = 'failure';
    });

    it('responds with 500', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ error: 'sample_error' });
    });
  });
});
