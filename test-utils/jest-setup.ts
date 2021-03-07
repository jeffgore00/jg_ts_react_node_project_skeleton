/* eslint-disable @typescript-eslint/no-throw-literal */

process.on('unhandledRejection', (err) => {
  throw err;
});
