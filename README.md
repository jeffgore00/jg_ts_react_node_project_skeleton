# TypeScript-React-Node Project Skeleton

## What

This is a boilerplate for a Node-Express backend, React frontend web application using TypeScript. It also contains some configuration for a simple Circle CI pipeline that runs the tests, then deploys a build to Heroku.

Out of the box:

A very simple homepage at `GET /`

A `GET /api/health` route which the server currently deployed commit, package.json version, and server uptime (works with Herkou)
A `PUT /api/logs` route for logging events from the front-end.

## Why

It attempts to integrate all the best practices of quality software. You get

Development experience / quality

- eslint and prettier fixes running as a Husky pre-commit hook
- commit message standards with commitlint running on a Husky pre-commit hook
- auto-reloading with webpack dev server and nodemon
- development logger with color coded log levels
  (picture)

Testing

- Unit testing with Jest in conjunction with react-testing-library for the frontend, and supertest for API tests on the backend
- Automation with WebdriverIO (both locally with Chromedriver, and headless with Selenium Docker), with option to save screenshots of tests at the point of failing or of completion

Build

- Webpack with React loaded externally to minimize build size, option to bundle if offline
- A gzipped client-side bundle
-

Production

- Release with standard-release
- Logging for every request/response with Morgan
- Arbitrary logging with Winston
- Boilerplate for CI with CircleCI
- Health check API
- React error boundary for front-end errors

Security

- Helmet
- CORS applicable on a route level

Little stuff

- Icons for your social media

## Caveats / Important Points

Since most web applications have at least an application server and a front end, this boilerplate includes that. But it does not include any client-side routing, nor does it include any boilerplate for session management or persistent storage.

The Node server is a simple HTTP server which relies on Heroku magic to make it an HTTPS server.

## To-do list

- [] Replace all instances of `ts-react-node-project-skeleton` with your application name
- [] If you intend to run browser tests in Chrome, make sure the `chromedriver` dev dependency matches your local version of chrome
- [] If you don't intend to integrate this with a circleci pipeline, delete the `.circleci` folder
- [] If you don't intend to deploy this to Heroku, delete the `view-prod-logs` npm script and alter the `src/server/utils/get-server-status.ts` file to use a different method (currently a Heroku-specific env ar) to get the SHA hash of the currently deployed git commit.
- [] Delete this to-do list along with everything above it.

## Run the app

For development, use this:

```
npm run start:dev
```

This starts the application server on :1337 and the webpack dev server on :8080. Once webpack has compiled the client-side bundle, it will automatically open localhost:8080 in the browser. All changes in the `/server` and `/client` directories are watched, which means that

By default, React is not bundled to minimize client bundle size. It is fetched via CDN. But if you are working offline:

```
npm run start:dev:offline
```

This will signal the webpack bundler to include React and ReactDOM in the bundle.

As expected, this is the command you want in production:

```
npm start
```

## Test

Unit tests live alongside their files.

API tests are in `test-api` and are named after the server route exposed, with the exception of `_root`

Both of the above are run with Jest.

Automated browser tests are in `test-browser` and are run with WDIO in conjunction with Jasmine. See browser testing for more.

The `npm t` script runs test, prettier and lint

<!-- Tests are run in band since that actually turns out to be faster. Also some strange issues with `supertest` when run in band. -->

## Build

`build:client` generates a webpack bundle in `public/webpack.bundle.js`.

`build:server` compiles the server TypeScript code into JavaScript and dumps the compiled code into the `dist` directory.

`build` runs both `build:client` and `build:server`.

## Automation

To run non-headless automation locally, simply run `npm run test:browser -- -c`. As long as the major version of your `chromedriver` dev dependency matches your locally installed Chrome major version, this should work.

To run headless automation on a Selenium server against a deployed environment:

1. `npm run selenium`
2. `npm run test:browser`
