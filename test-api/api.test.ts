import request from 'supertest';
import fs from 'fs';
import path from 'path';

import app from '../src/server/app';

describe('GET /api', () => {
  const indexHtmlPath = path.join(__dirname, '../public/index.html');

  describe('When public/index.html exists', () => {
    /* The index.html is generated from a template on the build step and is not
    committed to source control, which means this file is not guaranteed to exist
    before the test begins.

    Therefore if there is no built HTML file available, this `describe` will
    create a dummy HTML file to ensure a consistent test precondition, and will
    delete it after the test completes. */
    let htmlExistedPriorToTest = true;

    beforeAll(() => {
      try {
        fs.readFileSync(indexHtmlPath);
      } catch (err) {
        htmlExistedPriorToTest = false;
        fs.writeFileSync(indexHtmlPath, '<html></html>');
      }
    });

    afterAll(() => {
      if (!htmlExistedPriorToTest) {
        fs.unlinkSync(indexHtmlPath);
      }
    });

    it('responds with public/index.html', async () => {
      const response = await request(app).get('/');
      expect(response.status).toEqual(200);
      expect(response.header['content-type']).toEqual(
        'text/html; charset=UTF-8'
      );
    });
  });

  describe('When public/index.html does not exist', () => {
    /* The index.html is generated from a template on the build step and is not
    committed to source control. Still, it could already exist as the result of
    the local development process.

    Therefore this `describe` will delete any existing index.html file and
    restore it after completes to ensure a consistent test precondition. */
    let preexistingHtml = '';

    beforeAll(() => {
      try {
        preexistingHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
        fs.unlinkSync(indexHtmlPath);
      } catch (err) {
        // do nothing, a missing index.html is what we want for this test.
      }
    });

    afterAll(() => {
      if (preexistingHtml) {
        fs.writeFileSync(indexHtmlPath, preexistingHtml);
      }
    });

    it('responds with 404 and "HTML not found"', async () => {
      const response = await request(app).get('/');
      expect(response.status).toEqual(404);
      expect(response.text).toEqual('Main HTML file not found!');
    });
  });
});

describe('When the requested HTTP operation is not recognized', () => {
  it('responds with 404 and restates the unrecognized operation in an error message', async () => {
    let response = await request(app).get('/puppies');
    expect(response.status).toEqual(404);
    expect(response.text).toEqual(
      'Operation GET /puppies not recognized on this server.'
    );

    response = await request(app).post('/');
    expect(response.status).toEqual(404);
    expect(response.text).toEqual(
      'Operation POST / not recognized on this server.'
    );
  });
});
