/* eslint-disable @typescript-eslint/no-namespace, import/no-extraneous-dependencies */
import { JasmineOpts } from '@wdio/jasmine-framework';
import { Options } from '@wdio/types';

declare global {
  namespace NodeJS {
    interface Global {
      wdioBaseUrl: string;
    }
  }
}

const jasmineOpts: JasmineOpts = {
  defaultTimeoutInterval: 50000, // default is 60000
};

const config: Options.Testrunner = {
  runner: 'local',
  specs: ['./test-browser/specs/**/*.browser.test.ts'],
  maxInstances: 10,
  path: '/wd/hub',
  /*  automationProtocol: 'webdriver' was the default in WDIO v5, now v7 default is 'devtools'
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
  autoCompileOpts: {
    tsNodeOpts: {
      transpileOnly: true,
      project: 'tsconfig.wdio.json',
    },
  },
  before() {
    global.wdioBaseUrl = 'https://ts-react-node-project-skeleton.herokuapp.com'; // edit to deployed env if necessary
  },
};

export { config };
