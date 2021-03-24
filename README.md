# 💀 TypeScript-React-Node Project Skeleton 💀

[![CircleCI](https://circleci.com/gh/jeffgore00/ts-react-node-project-skeleton.svg?style=shield)](https://app.circleci.com/pipelines/github/jeffgore00/ts-react-node-project-skeleton?branch=master)
[![Codecov](https://img.shields.io/codecov/c/gh/jeffgore00/ts-react-node-project-skeleton)](https://app.codecov.io/gh/jeffgore00/ts-react-node-project-skeleton/)

This is a boilerplate for a Node-Express backend, React frontend web application which utilizes unit, API, and browser tests.

Everything possible, from functional code to tests to config files, is written in TypeScript.

It also contains the configuration for a simple CircleCI pipeline that runs the unit and API tests, then deploys a build to Heroku.

- [💀 TypeScript-React-Node Project Skeleton 💀](#-typescript-react-node-project-skeleton-)
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
  - [Test](#test)
    - [Unit Tests](#unit-tests)
    - [API Tests](#api-tests)
    - [Browser Tests](#browser-tests)

# Part 1. About This Boilerplate (Delete After You Clone)

## User-facing functionality and public APIs

Since this is a boilerplate, the functionality out-of-the-box is minimal.

- A very simple homepage at `GET /`:

  ![Homepage Screenshot](/public/readme-boilerplate-homepage.png 'Homepage Screenshot')

* A `GET /api/health` route which returns JSON of the `package.json` version, server uptime, and the currently deployed commit (Heroku only).
* A `PUT /api/logs` route for logging events from the front-end.

You can see this in practice at https://ts-react-node-project-skeleton.herokuapp.com.

## Non-user-facing functionality

Despite the limited functionality from a user's perspective, there's a lot from the developer's perspective. This is a heavy boilerplate, aiming at quality, reliability, and a frictionless developer experience.

Here is some marketing for what this project skeleton provides:

### Development experience / QA

- Pre-commit hooks implemented with Husky to encourage committing clean code:
  - eslint with Airbnb configuration running with a `--fix` flag
  - prettier both running with a `--write` flag
  - commitlint running the default conventional commit to ensure standards
- Auto-reloading with webpack dev server and nodemon to ensure you won't have to manually rebuild or restart anything in development.
- A development logger with color coded log levels (see logging)
- Use of `styled-components` in conjunction with `` to see styled component names when looking at components with React Dev Tools

### Testing

- Unit testing with Jest, utilizing its code coverage reporter
  - ...in conjunction with react-testing-library for the frontend...
  - ...and supertest for API tests on the backend.
- Automation with WebdriverIO/Jasmine with one passing test out of the box
  - Custom CLI flags built in to facilitate ease of use
  - locally with Chromedriver, headless with Selenium Docker
  - option to save screenshots of tests at the point of failing or of completion
  - Automatic logging of the URL whenever a page is opened

### Client Bundle Optimization

- Webpack with React loaded externally to minimize build size, option to bundle if offline
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

- Icons for your social media links in `/public`

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

## Contributing

<!-- ## Links -->

## Post-clone to-do list

This list assumes you would like all the features of this boilerplate and are using CircleCI with Codecov.

- [ ] Fork or clone this repo. The `main` branch contains the single commit that can serve as the boilerplate. Note that this repo includes a `develop` branch with all the commits that led to its creation. Delete or overwrite it as needed, or you could clone only the `main` branch from the start.
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
- [ ] If your app is deployed somewhere other than Heroku,
  - [ ] Update the production URLs in `src/shared/config`
  - [ ] Update the production URL in `wdio.conf.ts`.

### The final item

- [ ] After all other items are complete, delete this to-do list along with all the content above it (i.e. Part 1 of this README).

# Part 2. Operating Instructions (Keep These After You Clone)

## Usage

To start the application in development, use this:

```
npm run start:dev
```

This starts the application server on port 1337 and the webpack dev server on port 8080. Once webpack has compiled the client-side bundle, it will automatically open `http://localhost:8080` in your default web browser. All changes in the `/server` and `/client` directories are watched by Nodemon and webpack-dev-server respectively, which means those servers will restart if any of the files they watch are modified.

By default, React is fetched via CDN, rather than bundled, to minimize the size of `bundle.js`. But this default configuration does not allow for offline development. Therefore if you need to work offline, use this:

```
npm run start:dev:offline
```

This will signal the webpack bundler to include React and React DOM in the bundle.

As expected, this is the command you want in production:

```
npm start
```

The above will start an HTTP server on `process.env.PORT` if that is defined, otherwise port 1337. This assumes that the compiled server code is available in `/dist`.

## Build

You generally don't need to touch these in development (see `npm run start:dev`).

- `build:client` generates a webpack bundle in `public/webpack.bundle.js`, along with a gzip-compressed version.

- `build:server` compiles the server TypeScript code into JavaScript and dumps the compiled code into the `dist` directory.

- `build` runs both `build:client` and `build:server`.

## Logging

A dedicated `logger` exists on the application server in `src/server/utils/logger` with the methods `.error`, `.warn`, `.info`, and `.debug`.

```
logger.info('Fetching ships from Star Wars API')
```

You can pass arbitrary additional data in the form of key-value pairs as a second argument:

```
logger.info('Fetched ships from Star Wars API', { id: 1, name: 'X-Wing' })
```

In development, this results in color-coded logs in which the additional data (if any) is dimmed.

The `.error` logger has some extra logic: if the additional data object passed in is an instance of an `Error`, it will serialize the error and print the stack trace.

A logger with the same function signature is available to front-end code as well in `client/logger`. It sends the log to the `/api/logs` endpoint, which then results in the server `logger` performing its duties per above.

The server `logger` ultimately ends up as a simple console log, but can be configured via Winston transports to write the log content to another location.

## Test

All test files end in the extension `.test.ts`. Beyond that, the extensions vary by test type.

- Unit tests: `.test.ts`
- API tests: `.api.test.ts`
- Browser tests: `.browser.test.ts`

This repo utilizes Jest for unit and API tests. Together, they account for the code coverage statistics and can be run with:

```
npm run test-unit-and-api
```

The standard `npm test` script not only runs the above, but also an ESLint and Prettier check. This is designed to be run in a CI pipeline.

This repo does not contain the necessary configuration to run automated browser tests in CI. Therefore, if you want to run _all_ tests with one script, use:

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

The `npm run test:browser` script simply runs the `wdio` WebdriverIO binary with a configuration file as an argument, per its standard usage. Therefore you can pass any valid WDIO flag to this script, along with a few custom flags listed below.

To run non-headless automation locally, simply run `npm run test:browser -- -c`. As long as the major version of your `chromedriver` dev dependency matches your locally installed Chrome major version, this should work.

To run headless automation on a Selenium server against a deployed environment:

1. `npm run selenium`
2. `npm run test:browser -- -e prod`

Custom flags:

`-c, --chromedriver`. Use Chromedriver to run the tests. Default is `false`, meaning it expects an automation server to be running on :4444.

`-e, --environment`. The environment you want the tests pointed at. Default is `dev`, meaning WDIO will open your `localhost` app. The other option is `prod`. The URLs for your app in `dev` and `prod` can be found in `wdio.conf.ts`.

`-s, --screenshot`. Whether to take screenshots of the viewport during testing. Default is for `failedTestsOnly`, which will save one screenshot at the point of failure of a given assertion (`it`) in the `test-results-screenshots` directory. Other options are `always` (screenshots for every `it`, at the point of failure or success), and `never`.
