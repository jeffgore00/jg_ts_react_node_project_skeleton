/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/ban-ts-comment */
import { JasmineOpts } from '@wdio/jasmine-framework';
import { Options } from '@wdio/types';
import yargs from 'yargs/yargs';
import fs from 'fs';

/* "[In Node, the] first element will be process.execPath ... The second element will be the path to
the JavaScript file being executed. The remaining elements will be any additional command-line
arguments."  https://nodejs.org/docs/latest/api/process.html#process_process_argv */
const rawCommandLineArgs = process.argv.slice(2);

/* Avoiding aliases reserved by WDIO itself (i.e. the `wdio` command):
  -f, --framework        defines the framework (Mocha, Jasmine or Cucumber) to run the specs
  -h, --hostname         automation driver host address
  -k, --key              corresponding access key to the user
  -l, --logLevel         level of logging verbosity
  -p, --port             automation driver port
  -r, --reporters        reporters to print out the results on stdout
  -u, --user             username if using a cloud service as automation backend
  -w, --waitforTimeout   timeout for all waitForXXX commands */

const { argv: parsedCommandLineArgs } = yargs(rawCommandLineArgs)
  .option('environment', {
    alias: 'e',
    describe: 'The environment to point the tests at',
    default: 'dev',
    choices: ['dev', 'prod'],
  })
  .option('screenshot', {
    alias: 's',
    describe:
      'Take a screenshot after a browser test (see test-result-screenshots directory)',
    choices: ['always', 'never', 'failedTestsOnly'],
    default: 'failedTestsOnly',
  })
  .option('chromedriver', {
    alias: 'c',
    describe:
      'Use chromedriver rather than assume Selenium server is running on :4444',
    type: 'boolean',
    default: false,
  });

const { environment, screenshot, chromedriver } = parsedCommandLineArgs;

const environmentMap = {
  dev: 'http://localhost:1337',
  prod: 'https://ts-react-node-project-skeleton.herokuapp.com',
};

declare global {
  namespace NodeJS {
    interface Global {
      wdioBaseUrl: string;
      specFilename: string;
      driver: {
        saveScreenshot: (filepath: string) => void;
      };
    }
  }
}

const jasmineOpts: JasmineOpts = {
  /* default is 60000, this is just to show how to provide typed Jasmine options */
  defaultTimeoutInterval: 59999,
};

const baseUrl = <string>environmentMap[environment];

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
  ...(chromedriver && { services: ['chromedriver'] }),
  framework: 'jasmine',
  reporters: ['spec'],
  jasmineOpts,
  autoCompileOpts: {
    tsNodeOpts: {
      project: 'tsconfig.wdio.json',
    },
  },
  before(capabilities, specs) {
    global.wdioBaseUrl = baseUrl;
    const specFilepathSegments = specs[0].split('/');
    global.specFilename = specFilepathSegments[specFilepathSegments.length - 1];
  },
  afterTest(test, context, { passed }) {
    const generateScreenshotName = () =>
      `${global.specFilename}`.toLowerCase().trim().split(/\s+/).join('-');

    const createEmptyScreenshotDirectory = () => {
      const directoryPath = './test-result-screenshots';
      if (fs.existsSync(directoryPath)) {
        fs.rmSync(directoryPath, { recursive: true });
      }
      fs.mkdirSync(directoryPath);
    };

    if (screenshot === 'failedTestsOnly' && !passed) {
      createEmptyScreenshotDirectory();
      global.driver.saveScreenshot(
        `test-result-screenshots/${generateScreenshotName()}.png`,
      );
    }
    if (screenshot === 'all') {
      createEmptyScreenshotDirectory();
      global.driver.saveScreenshot(
        `test-result-screenshots/${generateScreenshotName()}.png`,
      );
    }
  },
};

export { config };
