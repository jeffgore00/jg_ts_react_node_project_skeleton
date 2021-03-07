/* eslint-disable @typescript-eslint/no-namespace */
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
  /* default is 60000, this is just to show how to provide typed Jasmine options */
  defaultTimeoutInterval: 59999,
};

const baseUrl = 'https://ts-react-node-project-skeleton.herokuapp.com';

const config: Options.Testrunner = {
  runner: 'local',
  specs: ['./test-browser/specs/**/*.browser.test.ts'],
  maxInstances: 10,
  path: '/wd/hub',
  /*  automationProtocol: 'webdriver' was the default in WDIO v5, now v7 default is 'devtools'
  (Chrome DevTools Protocol). "...to run a local test script you won't need to download a browser
  driver anymore. WebdriverIO checks if a browser driver is running and accessible at
  localhost:4444/ and uses Puppeteer as fallback if not." */
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
  baseUrl,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['chromedriver'],
  framework: 'jasmine',
  reporters: ['spec'],
  jasmineOpts,
  autoCompileOpts: {
    tsNodeOpts: {
      project: 'tsconfig.wdio.json',
    },
  },
  before() {
    global.wdioBaseUrl = baseUrl;
  },
};

export { config };
