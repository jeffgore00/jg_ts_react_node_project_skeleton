# TypeScript-React-Node Project Skeleton

React is not bundled so you can't work on this offline.

## Build

`build:client` generates a webpack bundle in `public/webpack.bundle.js`.

`build:server` compiles the server TypeScript code into JavaScript and dumps the compiled `server` directory in the `dist` directory. The `dist` directory matches the hierarchy of the `src` directory, i.e. `dist/server` maps to `src/server`. This is important for testing and local development, as `start:dev` runs the TypeScript server code directly with `ts-node`, while `start` runs the compiled TypeScript code.

This is why the `health-check.ts` and `edit-healthfile.ts` files are excluded from the server build in `tsconfig.server.json` and executed separately - because the health check reaches outside of the server folder and requires the `package.json` in the root directory, the the build would result in a non-matching hierarchy: `src/server` vs `dist/src/server`. _If you add anything else in `/server` that requires something outside of `/server`, the app will break!_

`build` runs both `build:client` and `build:server`.

## Automation

To run non-headless automation locally, simply run `npm run test:browser`. As long as the major version of your `chromedriver` dev dependency matches your locally installed Chrome major version, this should work.

To run headless automation on a Selenium server, comment out or remove:

```
services: ['chromedriver'],
```

...from the wdio.conf.js file. Then:

1. `npm run selenium`
2. `npm run test:browser`
