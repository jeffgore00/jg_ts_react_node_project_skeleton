import request from 'supertest';
import fs from 'fs';
import path from 'path';

import app from '../src/server/app';

describe('GET /', () => {
  describe('When public/index.html exists', () => {
    let noHtmlBuild = false;
    const indexHtmlPath = path.join(__dirname, '../public/index.html');

    beforeAll(() => {
      try {
        fs.readFileSync(indexHtmlPath);
      } catch (err) {
        fs.writeFileSync(
          indexHtmlPath,
          `<html>
            <head>
                <meta charset="UTF-8" />
            </head>
            </html>`
        );
        noHtmlBuild = true;
      }
    });

    afterAll(() => {
      if (noHtmlBuild) {
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
    let preexistingHtml = '';
    const indexHtmlPath = path.join(__dirname, '../public/index.html');

    beforeAll(() => {
      try {
        preexistingHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
        fs.unlinkSync(indexHtmlPath);
      } catch (err) {
        // do nothing, no index.html in build folder
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

describe('When the requested HTTP method + route combination is not recognized', () => {
  it('responds with 404', async () => {
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
