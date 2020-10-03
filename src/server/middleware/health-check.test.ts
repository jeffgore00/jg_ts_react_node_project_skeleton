import path from 'path';
import fs from 'fs';

import healthCheckMiddleware from './health-check';

jest.mock('date-fns', () => ({
  formatDistanceToNow: (): string => 'four hours',
}));

describe('The health-check middleware', () => {
  const healthfilePath = path.join(__dirname, '../health.json');
  let healthfileContents: string;
  let request: any;
  let response: any;
  let next: any;

  beforeAll(() => {
    request = () => {};
    response = {
      json: jest.fn(),
    };
    next = () => {};
    healthfileContents = fs.readFileSync(healthfilePath, 'utf-8');
  });

  it('responds with contents of health.json, plus the server uptime', () => {
    healthCheckMiddleware(request, response, next);
    expect(response.json).toBeCalledWith({
      ...JSON.parse(healthfileContents),
      uptime: 'four hours',
    });
  });
});
