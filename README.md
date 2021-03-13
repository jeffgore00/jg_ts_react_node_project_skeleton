# TypeScript-React-Node Project Skeleton

## Test

Tests are run in band since that actually turns out to be faster. Also some strange issues with `supertest` when run in band.

## Build

`build:client` generates a webpack bundle in `public/webpack.bundle.js`.

`build:server` compiles the server TypeScript code into JavaScript and dumps the compiled code into the `dist` directory.

`build` runs both `build:client` and `build:server`.

## Automation

To run non-headless automation locally, simply run `npm run test:browser -- -c`. As long as the major version of your `chromedriver` dev dependency matches your locally installed Chrome major version, this should work.

To run headless automation on a Selenium server against a deployed environment:

1. `npm run selenium`
2. `npm run test:browser`
