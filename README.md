# TypeScript-React-Node Project Skeleton

This is a boilerplate for a Node-Express backend, React frontend web application using TypeScript which utilizes unit, API, and browser tests. It also contains some configuration for a simple Circle CI pipeline that runs the unit/API tests, then deploys a build to Heroku.

- [TypeScript-React-Node Project Skeleton](#typescript-react-node-project-skeleton)
  - [Built-in Functionality](#built-in-functionality)
  - [Under the hood](#under-the-hood)
    - [Development experience / quality](#development-experience--quality)
    - [Testing](#testing)
    - [Build](#build)
    - [Production Readiness](#production-readiness)
    - [Security](#security)
    - [Little stuff](#little-stuff)
  - [Caveats / Important Points](#caveats--important-points)
  - [To-do list](#to-do-list)
  - [Usage](#usage)
    - [Running the app](#running-the-app)
    - [Logging](#logging)
  - [Test](#test)
    - [Unit Tests](#unit-tests)
    - [API Tests](#api-tests)
    - [Browser Tests](#browser-tests)
  - [Build](#build-1)
  - [Contributing](#contributing)

## Built-in Functionality

Since this is a boilerplate, the functionality out-of-the-box is minimal.

- A very simple homepage at `GET /`:
-

* A `GET /api/health` route which returns JSON of the currently deployed commit (Heroku only), `package.json` version, and server uptime
* A `PUT /api/logs` route for logging events from the front-end.

## Under the hood

Despite the limited functionality from a user's perspective, there's a lot from the developer's perspective.

### Development experience / quality

- Pre-commit hooks implemented with Husky to encourage committing clean code:
  - eslint with Airbnb configuration running with a `--fix` flag
  - prettier both running with a `--fix` flag
  - commitlint running to ensure standards
- Auto-reloading with webpack dev server and nodemon to ensure you won't have to manually rebuild or restart anything in development.
- A development logger with color coded log levels
  (picture)

### Testing

- Unit testing with Jest, utilizing its code coverage reporter
  - in conjunction with react-testing-library for the frontend
  - and supertest for API tests on the backend
- Automation with WebdriverIO/Jasmine with one passing test out of the box
  - Custom CLI flags built in to facilitate ease of use
  - locally with Chromedriver, headless with Selenium Docker
  - option to save screenshots of tests at the point of failing or of completion
  - Automatic logging of the URL whenever a page is opened

### Build

- Webpack with React loaded externally to minimize build size, option to bundle if offline
- A gzip-compressed client-side bundle
- A report from webpack-build-analyzer to help manage dependency size

### Production Readiness

- Proper CHANGELOG generation and updates with standard-release (note this requires commit message standards)
- Logging for every HTTP request/response with Morgan
- Arbitrary logging with Winston
- Boilerplate for CI with CircleCI
- Health check API
- Top level React error boundary to catch and log front-end errors

### Security

- Helmet applied with nearly default settings to server
- CORS applicable on a route level

### Little stuff

- Icons for your social media links

## Caveats / Important Points

1. This does not include any client-side routing.
2. This does not include any logic for session management or persistent storage.
3. The Node server is a simple HTTP server which relies on Heroku magic to allow HTTPS in production.

## To-do list

- [ ] Fork or clone this repo.
- [ ] Replace all instances of `ts-react-node-project-skeleton` with your application name.
- [ ] Update the <title> and <meta> tags in `public/index-template.html` with your project info.
- [ ] Delete `public/favicon.ico` or overwrite with your app's icon.
- [ ] If you intend to run browser tests in Chrome, make sure the `chromedriver` dev dependency matches your local version of Chrome.
- [ ] If you don't intend to integrate this with a Circle CI pipeline, delete the `.circleci` folder
- [ ] If you don't intend to deploy this to Heroku, delete or alter the `view-prod-logs` npm script and alter the `src/server/utils/get-server-status.ts` file to use a different method (currently a Heroku-specific environment variable) to get the SHA hash of the currently deployed git commit.
- [ ] If your app is deployed somewhere other than Heroku, update the URLs in `src/shared/config` and `wdio.conf.ts`.
- [ ] Delete this to-do list along with all the content above it.

## Usage

### Running the app

For development, use this:

```
npm run start:dev
```

This starts the application server on port 1337 and the webpack dev server on port 8080. Once webpack has compiled the client-side bundle, it will automatically open `http://localhost:8080` in the browser. All changes in the `/server` and `/client` directories are watched by Nodemon and webpack-dev-server respectively, which means those servers will restart if any of the files they watch are modified.

By default, React is fetched via CDN, rather than bundled, to minimize the size of `bundle.js`. But this default configuration does not allow for offline development. Therefore if you need to work offline, use this:

```
npm run start:dev:offline
```

This will signal the webpack bundler to include React and React DOM in the bundle.

As expected, this is the command you want in production:

```
npm start
```

### Logging

## Test

All tests end in `.test.ts`. Beyond that, the extensions vary by test type.

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

This will first run your browser tests using Chromedriver. Browser tests are run first because they should be the best indicator that your app actually works. If they fail, the script exits, and you will see screenshots for the failed tests in `test-result-screenshots` (see x for more). If they succeed, then it moves onto the unit and API tests.

### Unit Tests

Unit tests have the same name and location as the files they are testing, with the exception of the file extension.

### API Tests

API tests assert the expected HTTP response of the server at a specific route, given a possible variety of request scenarios.

```
WHEN I make a PUT request to /api/logs
AND my request is in the correct shape
THEN I should receive a 200 response

WHEN I make a GET request to /api/health
THEN I should receive a 200 response
AND the response should take this shape
```

They do not test side effects, such as logging, because this test is from the point of view of the consumer of the API. They are a type of integration test, as a server route often involves several middleware working in tandem. For that reason, API tests should not mock or stub out any source code (with the exception of logging code, in order to keep the console free of noise during a test).

API tests are located in `test-api` and are named after the `/api/____` server route exposed, with the exception of `_root` which is named after the main `/` route.

### Browser Tests

Automated browser tests are located in the `test-browser` directory and are run with WDIO in conjunction with Jasmine.

The `npm run test:browser` script simply runs the `wdio` WebdriverIO binary with a configuration file as an argument, per its standard usage. Therefore you can pass any valid WDIO flag to this script, along with a few custom flags listed below.

To run non-headless automation locally, simply run `npm run test:browser -- -c`. As long as the major version of your `chromedriver` dev dependency matches your locally installed Chrome major version, this should work.

To run headless automation on a Selenium server against a deployed environment:

1. `npm run selenium`
2. `npm run test:browser -- -e prod`

Custom flags:

`-c, --chromedriver`. Use Chromedriver to run the tests. Default is `false`, meaning it expects an automation server to be running on :4444.

`-e, --environment`. The environment you want the tests pointed at. Default is `dev`, meaning WDIO will open your `localhost` app. The other option is `prod`. The URLs for your app in `dev` and `prod` can be found in `wdio.conf.ts`.

`-s, --screenshot`. Whether to take screenshots of the viewport during testing. Default is for `failedTestsOnly`, which will save one screenshot at the point of failure of a given assertion (`it`) in the `test-results-screenshots` directory. Other options are `always` (screenshots for every `it`, at the point of failure or success), and `never`.

## Build

`build:client` generates a webpack bundle in `public/webpack.bundle.js`.

`build:server` compiles the server TypeScript code into JavaScript and dumps the compiled code into the `dist` directory.

`build` runs both `build:client` and `build:server`.

## Contributing
