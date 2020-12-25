# TypeScript-React-Node Project Skeleton

## Build

`build:client` generates a webpack bundle in `public/webpack.bundle.js`.

`build:server` compiles the server TypeScript code into javascript and dumps the compiled `server` directory in the `dist` directory. The `dist` directory matches the hierarchy of the `src` directory, i.e. `dist/server` maps to `src/server`. This is important for testing and local development, as `start:dev` runs the TypeScript server code directly with `ts-node`, while `start` runs the compiled TypeScript code.

This is why the `edit-healthfile.ts` file is excluded from the server build in `tsconfig.server.json` and executed separately - because that file reaches outside of the server folder and requires requires the `package.json` in the root directory, the the build would result in a non-matching hierarchy: `src/server` vs `dist/src/server`. _If you add anything else in `/server` that requires something outside of `/server`, the app will break!_

`build` runs both `build:client` and `build:server`.
