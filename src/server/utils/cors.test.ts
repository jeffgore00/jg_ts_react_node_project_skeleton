import { corsStrictSameOrigin } from './cors';

describe('CORS Strict same origin', () => {
  describe('When the origin is in the whitelist', () => {});
  describe('When the origin is not in the whitelist', () => {
    describe('When the whitelist contains *', () => {
      it('works', () => {});
    });
    describe('When the whitelist does not contain *', () => {});
  });
});
