# 💀 TypeScript-React-Node Project Skeleton 💀

[![CircleCI](https://circleci.com/gh/jeffgore00/ts-react-node-project-skeleton.svg?style=shield)](https://app.circleci.com/pipelines/github/jeffgore00/ts-react-node-project-skeleton?branch=master)
[![Codecov](https://img.shields.io/codecov/c/gh/jeffgore00/ts-react-node-project-skeleton)](https://app.codecov.io/gh/jeffgore00/ts-react-node-project-skeleton/)

This is a boilerplate for a Node-Express backend, React frontend web application which utilizes unit, API, and browser tests.

Everything possible, from functional code to tests to config files, is written in TypeScript.

It also contains the configuration for a simple CircleCI pipeline that runs the unit and API tests, then deploys a build to Heroku.

- [Part 1. About This Boilerplate (Delete After You Clone)](#part-1-about-this-boilerplate-delete-after-you-clone)
  - [User-facing functionality and public APIs](#user-facing-functionality-and-public-apis)
  - [Non-user-facing functionality](#non-user-facing-functionality)
    - [Development experience / QA](#development-experience--qa)
    - [Testing](#testing)
    - [Client Bundle Optimization](#client-bundle-optimization)
    - [Production Tools](#production-tools)
    - [Security](#security)
    - [Miscellaneous](#miscellaneous)
  - [Not Handled by This Boilerplate](#not-handled-by-this-boilerplate)
  - [Contributing](#contributing)
  - [Post-clone to-do list](#post-clone-to-do-list)
    - [Conditional to-do list](#conditional-to-do-list)
    - [The final item](#the-final-item)
- [Part 2. Operating Instructions (Keep These After You Clone)](#part-2-operating-instructions-keep-these-after-you-clone)
  - [Usage](#usage)
  - [Build](#build)
  - [Logging](#logging)
    - [Core Functionality](#core-functionality)
    - [Logging Caveats](#logging-caveats)
    - [Error Logging](#error-logging)
    - [Logging in Development](#logging-in-development)
    - [Passing Logs from Client to Server via API](#passing-logs-from-client-to-server-via-api)
  - [Testing](#testing-1)
    - [Test Structure](#test-structure)
    - [Unit Tests](#unit-tests)
    - [API Tests](#api-tests)
    - [Browser Tests](#browser-tests)

# Part 1. About This Boilerplate (Delete After You Clone)

## User-facing functionality and public APIs

Since this is a boilerplate, the user-facing functionality out-of-the-box is minimal.

- A very simple homepage at `GET /`:

  ![Homepage Screenshot](/public/readme-boilerplate-homepage.png 'Homepage Screenshot')

* A `GET /api/health` route which returns JSON of the `package.json` version, server uptime, and the currently deployed commit (Heroku only).
* A `PUT /api/logs` route for logging events from the front-end.

You can see this in practice at https://ts-react-node-project-skeleton.herokuapp.com.

## Non-user-facing functionality

Despite the limited functionality from a user's perspective, there's a lot to offer the developer who cares deeply about quality, but still wants to start writing feature code right away.

Here is some marketing for what this project skeleton provides:

### Development experience / QA

- Pre-commit hooks implemented with Husky to encourage committing clean code:
  - ESLint with an Airbnb configuration running with a `--fix` flag
  - prettier running with a `--write` flag
  - commitlint running with a conventional config
- Auto-reloading with webpack-dev-server and nodemon to ensure you won't have to manually rebuild or restart anything in development.
- A development logger with color coded log levels (see [Logging in Development](#logging-in-development) for more details)
- Use of `styled-components` in conjunction with `` to see styled component names when looking at components with React Developer Tools

### Testing

- Unit testing with Jest, utilizing its code coverage reporter
  - ...in conjunction with React Testing Library for the frontend...
  - ...and SuperTest for API tests on the backend.
- Automation with WebdriverIO/Jasmine with one passing test out of the box
  - Custom `wdio` CLI flags built in to facilitate ease of use
  - Runnable on your local machine in Chrome with Chromedriver, or in headless mode in a handful of browsers with Selenium Docker
  - Has the option to save screenshots of tests at the point of failing or of completion
  - Whenever WebdriverIO loads a new URL, logs the URL to the console

### Client Bundle Optimization

- Webpack with React loaded externally to minimize build size; option to bundle if offline
- A gzip-compressed client-side bundle
- A report from webpack-build-analyzer to help manage dependency size
- Source maps for debugging in the browser

### Production Tools

- Proper CHANGELOG generation and updates with standard-release (note this requires commit message standards)
- Logging for every HTTP request/response with Morgan
- Arbitrary logging with Winston
- Boilerplate for CI with CircleCI, including an upload of code coverage to Codecov
- Health check API (as described above)
- Top level React error boundary to catch and log front-end errors

### Security

- Helmet applied with nearly default settings to server
- CORS applicable on a route level, with ability to block or allow requests from tools like Postman

### Miscellaneous

- Icons for social media links in `/public`

> Note from Jeff:
>
> This boilerplate is my belief in what a repo should have as the basis for a healthy web application. It comes from my own experience developing and deploying production-ready (and in some cases, non-production-ready 😅 ) code for a Fortune 100 company.
>
> Is this boilerplate itself based on any boilerplate? Yes, a very light one with no backend. I started with a Webpack-TypeScript blog post on the TypeScript page that seems to have disappeared from the internet. That is where the idea of excluding React from the client bundle comes from, and I still have a quote from that boilerplate in the Webpack config.
>
> I tried create-react-app, but I found it was a nightmare to try to compile TypeScript that didn't live in `src`, such as the browser tests.
>
> Granted, this is a pretty opinionated boilerplate as well....

## Not Handled by This Boilerplate

1. This does not include any client-side routing.
2. This does not include any logic for authentication, session management or persistent storage.
3. The Node server is a simple HTTP server which relies on Heroku magic to allow for HTTPS in production. There is no logic for creating an HTTPS server with certs.
4. There is no logic for server-side rendering.

## Contributing

<!-- ## Links -->

## Post-clone to-do list

This list assumes you would like all the features of this boilerplate and are using CircleCI with Codecov.

- [ ] Fork or clone this repo. The `main` branch contains the single commit that can serve as the boilerplate.
- [ ] Replace all instances of `ts-react-node-project-skeleton` with your application name.
- [ ] Update the `<title>` and `<meta>` tags in `public/index-template.html` with your project info.
- [ ] Delete `public/favicon.ico` or overwrite with your app's icon.
- [ ] Make sure the `chromedriver` dev dependency matches your local version of Chrome.
- [ ] If you are using Codecov, sure your `CODECOV_TOKEN` environment variable is set in your CircleCI

### Conditional to-do list

This list is for those who may not want to use CircleCI, Heroku, or Codecov.

- [ ] If you don't intend to integrate this with a CircleCI pipeline:
  - [ ] Delete the `.circleci` folder
- [ ] If you don't intend to integrate this repo with Codecov:
  - [ ] Delete the `scripts` folder
  - [ ] Delete the `send-codecov-report` npm script from `package.json`.
        project settings (assumes you've integrated your app with Codecov).
- [ ] If you don't intend to deploy this to Heroku:
  - [ ] Delete the `view-prod-logs` npm script
  - [ ] Alter the `src/server/utils/get-server-status.ts` file to use a different method (currently a Heroku-specific environment variable) to get the SHA hash of the currently deployed git commit.
- [ ] If your app is deployed somewhere other than Heroku:
  - [ ] Update the production URL in `src/shared/config/production.json`
  - [ ] Update the production URL in `wdio.conf.ts`.

### The final item

- [ ] After all other items are complete, delete this to-do list along with all the content above it (i.e. Part 1 of this README).

# Part 2. Operating Instructions (Keep These After You Clone)

These commands assume you have a bash shell.

## Usage

To start the application in development, use this:

```
npm run start:dev
```

This starts the application server on port 1337 and the Webpack development server on port 8080. (This differs from the production/default setting, which is a single server for all content.)

Once Webpack has compiled the client-side bundle, it will automatically open `http://localhost:8080` in your default web browser. All changes in the `/server` and `/client` directories are watched by nodemon and webpack-dev-server respectively, which means those servers will restart if any of the files they watch are modified.

By default, `react` and `react-dom` is fetched via CDN, rather than bundled, to minimize the size of `bundle.js`. But this default configuration does not allow for offline development. Therefore if you need to work offline, use this:

```
npm run start:dev:offline
```

This will signal the Webpack bundler to include React and React DOM in the bundle.

As expected, this is the command you want in production:

```
npm start
```

The above will start an HTTP server on `process.env.PORT` if that is defined, otherwise port 1337. This assumes that the compiled server code is available in `/dist` (see `build:server`).

## Build

You generally don't need to run these scripts in development, since `npm run start:dev` requires zero explicit build.

- `build:client` generates a Webpack bundle in `public/webpack.bundle.js`, along with a gzip-compressed version.

- `build:server` compiles the server TypeScript code into JavaScript and dumps the compiled code into the `dist` directory.

- `build` runs `build:client`, followed by `build:server`.

## Logging

### Core Functionality

A dedicated `logger` exists on the application server in `src/server/utils/logger` with the methods `.error`, `.warn`, `.info`, and `.debug`, corresponding to different log levels.

Example usage:

```ts
logger.info('Fetching ships from Star Wars API');
```

The logger not only logs the message but attaches metadata: the log level, timestamp, as well as arbitrary metadata that you can provide. The `logger` outputs to the console, but can be configured via Winston transports to write the log content to another location. The above log in production looks like this (line breaks added for clarity):

```json
{
  "level": "info",
  "message": "Fetching ships from Star Wars API",
  "timestamp": "2021-03-28T16:26:32.219Z"
}
```

### Arbitrary

To add arbitrary metadata to a log, pass a second argument in the form of an object (values that are themselves objects will be stringified):

```ts
logger.info('Fetched current ship from Star Wars API', {
  shipId: 1,
  shipName: 'X-Wing',
  shipLocations: ['Alderaan', 'Tattoine'],
});
```

Production output:

```
{
  "shipId": 1,
  "shipName": "X-Wing",
  "shipLocations": ["Alderaan", "Tattoine"],
  "level": "info",
  "message": "Fetched current ship from Star Wars API",
  "timestamp": "2021-03-28T16:26:32.221Z"
}
```

### Logging Caveats

The downside of Winston's ability to pass arbitrary data is the possibility of interfering with core metadata.

```ts
logger.info('Hello', {
  level: 3, // will be ignored and does not affect log level
  message: 'hi', // will be appended to string above i.e. "Hello hi"
  timestamp: '20200903', // will overwrite the baked-in ISO timestamp
});
// output: { "level": "info", "message": "Hello hi","timestamp": "20200903" }
```

Do not use the names `level`, `message`, or `timestamp` as keys for arbitrary metadata. Would be nice if an ESLint plugin were out there to address this... :)

### Error Logging

If the additional data object is provided, contains the key name `error` and is an instance of an `Error`, the `logger` will pass the value through `serialize-error` before logging it. This allows you to see the stack trace of the error. (Note that this functionality exists at every log level, not just `.error` logs)

```ts
try {
  await axios.delete('https://www.cia.gov/api/agents/5');
} catch (error: unknown) {
  logger.error('Could not remove CIA secret agent', { error });
}
```

Production output:

```
{
  "error": {
    "name": "Error",
    "message": "Access denied",
    "stack": "Error: Access denied\n    at /Users/bobross/Desktop/ts-react-node-project-skeleton/src/server/app.ts:29:11\n    at Layer.handle [as handle_request] (/Users/bobross/Desktop/ts-react-node-project-skeleton/node_modules/express/lib/router/layer.js:95:5)"
  },
  "level": "error",
  "message": "Could not remove CIA secret agent",
  "timestamp": "2021-03-28T16:41:22.348Z"
}
```

### Logging in Development

In development, logs are color-coded and formatted in a non-JSON string to make them easier to read and distinguish from one another. Arbitrary metadata is dimmed and presented in the format of `key=value`, its keys prepended with `data_`. The timestamp metadata appears in grey.

![Development Logger Screenshot](/public/readme-dev-logger.png 'Development Logger Screenshot')

### Passing Logs from Client to Server via API

The server exposes an API to make this logger available to clients, such as a web browser. In turn, a logger with the same function signature as the server logger is available to front-end code in `src/client/utils/logger`. This client-side logger sends the log data to the `/api/logs` endpoint, which then results in the server `logger` processing the log per the behavior described above.

```ts
// 1. Example of use client-side in React component
useEffect(() => {
  void logger.info('Homepage rendered');
}, []);

// 2. Sends log as JSON to /api/logs
// 3. /api/logs middleware passes logging data to server's `logger.info`
```

It is recommended to call the client-side logger with `void` to avoid lint errors. The logger triggers an asynchronous operation - the network call to calling `/api/logs` - but `void` signifies that the promise result does not need to be awaited, since the functionality of the app does not depend on a log being sent successfully. If the promise is rejected, the app will use a vanilla `console.error` to log the error and the intended log message.

## Testing

### Test Structure

All test files end in the extension `.test.ts`. Beyond that, the extensions vary by test type.

- Unit tests: `<name>.test.ts`
- API tests: `<name>.api.test.ts`
- Browser tests: `<name>.browser.test.ts`

This repo utilizes Jest for unit and API tests. Together, they account for the code coverage statistics and can be run with:

```
npm run test-unit-and-api
```

The standard `npm test` is designed to be run in a CI pipeline. It not only runs the above `npm run test-unit-and-api` script, but also ESLint and Prettier check, along with a spellcheck of all Markdown documents in the repo.

This repo does not contain the necessary configuration to run automated browser tests in CI. Therefore, if you want to run _all_ tests with one script on your machine, use:

```
npm run test:full:local
```

This will first run your browser tests using Chromedriver. Browser tests are run first because they should be the best indicator that your app actually works. If they fail, the script exits, and you will see screenshots for the failed tests in `test-result-screenshots` (see the Browser Tests section for more). If the browser tests succeed, then the script moves onto the unit and API tests.

### Unit Tests

A unit test file has the same name and location as the file it is designed to test, with the exception of the file extension. For example:

```

/server
|_ app.ts
|_ app.test.ts

```

### API Tests

API tests assert the expected HTTP response of the application server at a specific route, given a possible variety of request scenarios.

```

WHEN I make a PUT request to /api/logs
AND my request is in the correct shape
THEN I should receive a 200 response

WHEN I make a GET request to /api/health
THEN I should receive a 200 response
AND the response should be in the expected schema

```

They do not test side effects, such as logging, because this test is from the point of view of the consumer of the API. They are a type of integration test, as a server route often involves several middleware working in tandem. For that reason, API tests should not mock or stub out any source code (with the exception of logging code, in order to keep the console free of noise during a test).

API tests are located in `test-api` and are named after the `/api/____` server route being tested, with the exception of `_root` which is named after the main `/` route.

### Browser Tests

Automated browser tests open a browser and simulate the actions of a user on your web page, such as clicking, typing into fields, and scrolling.

In this repo, these tests are located in the `test-browser` directory and are run with WebdriverIO with the Jasmine framework.

(Jest is currently not supported by WebdriverIO as an integrated test framework. Jasmine, being an ancestor of Jest, is st)

The `npm run test:browser` script runs the `wdio` WebdriverIO binary with a configuration file as an argument, per its standard usage. (The configuration is found in `wdio.conf.ts`.)

Therefore you can pass any valid WDIO flag to this script, along with a few custom flags listed below.

To run non-headless automation locally, run `npm run test:browser -- -c`. As long as the major version of your `chromedriver` dev dependency matches your locally installed Chrome major version, this should work.

To run headless automation on a Selenium server against a deployed environment:

1. `npm run selenium`
2. `npm run test:browser -- -e prod`

To view all the flags for the `test:browser` script, you can use the `--info` command:

```
npm run test:browser -- --info
```

The definitions for these flags can be found in `wdio.conf.ts`.
