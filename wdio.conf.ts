/* eslint-disable @typescript-eslint/no-namespace, import/no-extraneous-dependencies */

import { Options } from '@wdio/types';

declare global {
  namespace NodeJS {
    interface Global {
      wdioBaseUrl: string;
    }
  }
}

/*
For proper typing here, this would object be of JasmineOpts type:

import { JasmineOpts } from '@wdio/jasmine-framework'
const jasmineOpts: JasmineOpts = ...

Problem is, the import of this library means that Jasmine types are injected into all the
files covered by tsconfig.json, as if "@wdio/jasmine-framework" were included in the "types"
array. And the Jasmine types conflict with the Jest types (i.e., both have "expect", but
with different methods).

 */
const jasmineOpts = {
  defaultTimeoutInterval: 50000, // default is 60000
};

const config: Options.Testrunner = {
  runner: 'local',
  specs: ['./test-browser/specs/**/*.browser.test.ts'],
  maxInstances: 10,
  path: '/wd/hub',
  /*  automationProtocol: 'webdriver' was the default in WDIO v5, now v6 default is 'devtools'
      (Chrome DevTools Protocol).
      "to run a local test script you won't need to download a browser driver anymore. WebdriverIO
      checks if a browser driver is running and accessible at localhost:4444/ and uses Puppeteer as
      fallback if not"
  */
  automationProtocol: 'webdriver',
  capabilities: [
    {
      maxInstances: 5,
      browserName: 'chrome',
      acceptInsecureCerts: true,
    },
  ],
  logLevel: 'warn',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['chromedriver'],
  framework: 'jasmine',
  reporters: ['spec'],
  jasmineOpts,
  before() {
    global.wdioBaseUrl = 'http://localhost:1337'; // edit to deployed env if necessary
  },
};

export { config };
