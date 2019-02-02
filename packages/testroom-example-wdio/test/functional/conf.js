exports.config = {
  specs: [
    './test/functional/specs/*.feature',
  ],
  exclude: [],
  services: ['selenium-standalone'],
  maxInstances: 1,
  capabilities: [{
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--disable-gpu', '--window-size=1280,800']
    }
  }],
  sync: true,
  coloredLogs: true,
  screenshotPath: './errorShots/',
  baseUrl: 'http://the-internet.herokuapp.com/',
  waitforTimeout: 15000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  framework: 'cucumber',
  reporters: ['spec'],
  reporterOptions: {
    outputDir: './output/reports'
  },
  cucumberOpts: {
    compiler: ["ts:ts-node/register"],
    require: [
        './test/functional/steps/test.ts'
    ],
    backtrace: true,
    dryRun: false,
    failFast: false,
    format: ['pretty'],
    colors: true,
    snippets: true,
    source: true,
    profile: [],
    strict: true,
    timeout: 20000,
    ignoreUndefinedDefinitions: false,
  },
  before: function before() {
    browser.timeouts('implicit', 5000);
    const chai = require('chai');
    global.expect = chai.expect;
    global.assert = chai.assert;
    global.should = chai.should();
  },
};