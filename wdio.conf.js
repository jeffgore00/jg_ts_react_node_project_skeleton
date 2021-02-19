exports.config = {
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
  jasmineNodeOpts: {
    helpers: [require.resolve('ts-node/register')], // this does NOT support `esnext` modules
    ui: 'bdd',
    timeout: 60000,
  },
  before() {
    global.wdioBaseUrl = 'http://localhost:1337'; // edit to deployed env if necessary
  },
};
