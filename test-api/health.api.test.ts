import request from 'supertest';

import app from '../src/server/app';

const regexSemver = /^((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/gm;
const regexSHA1 = /\b[0-9a-f]{40}\b/;

describe('GET /api/health', () => {
  describe('When the git commit hash is retrieved successfully', () => {
    beforeAll(() => {
      // mock out util to succeed
    });

    it('responds with the server uptime, repo version, and latest commit hash', async () => {
      throw new Error('finish this');
      const response = await request(app).get('/api/health');
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          version: expect.stringMatching(regexSemver),
          uptime: expect.any(String), // date in human-readable format
          commit: expect.stringMatching(regexSHA1),
        })
      );
    });
  });

  describe('When there is an error retrieving the git commit', () => {
    beforeAll(() => {
      // mock out util to fail
    });

    it('responds with 500', async () => {
      throw new Error('finish this');
      const response = await request(app).get('/api/health');
      expect(response.status).toEqual(500);
      expect(response.body).toEqual({ error: 'sample_error' });
    });
  });
});
