import { getConfig } from '.';

describe('get config', () => {
  describe('When Process.env.node_env is defined', () => {
    describe('when the value maps to one of the valid configs', () => {
      it('works', () => {});
    });
    describe('when the value does not map to one of the valid configs', () => {});
  });
  describe('When Process.env.node_env is not defined', () => {});
});
