/*
- test that logging middleware is applied correctly
- test the default 500 response message when there is no error message
*/

describe('hi', () => {
  it('fails', () => {
    throw new Error('write this test');
  });
});
