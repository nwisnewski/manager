require('dotenv').config();

const { readFileSync, unlinkSync } = require('fs');
const { argv } = require('yargs');
const {
    login,
    generateCreds,
    checkoutCreds,
    checkInCreds,
    removeCreds,
    deleteAllData,
} = require('../utils/config-utils');

const { resetAccounts } = require('../setup/cleanup');

const { browserCommands } = require('./custom-commands');
const { browserConf } = require('./browser-config');
const { constants } = require('../constants');
const { keysIn } = require('lodash');
const selectedBrowser = argv.browser ? browserConf[argv.browser] : browserConf['chrome'];

const specsToRun = () => {
    if (argv.file) {
        return [argv.file];
    }

    if (argv.spec) {
        return argv.spec.split(',');
    }

    if (argv.dir || argv.d) {
        return [`./e2e/specs/${argv.dir || argv.d}/**/*.spec.js`]
    }

    if (argv.smoke) {
        return ['./e2e/specs/**/smoke-*spec.js'];
    }
    return ['./e2e/specs/**/*.js'];
}

const specs = specsToRun();

const selectedReporters = argv.log ? ['spec', ['junit', { outputDir: './e2e/test-results',}],
    ['allure', {outputDir: './e2e/html-results', disableWebdriverStepsReporting: false, disableWebdriverScreenshotsReporting: false,}]] : ['dot'];

const getRunnerCount = () => {
    const userCount = keysIn(process.env).filter(users => users.includes('MANAGER_USER')).length;
    const specsCount = specs.length;
    const isSuite = specs[0].includes('**');
    const isParallelRunner = (isSuite || specsCount > 1) && userCount > 1;
    return  isParallelRunner ? userCount : 1;
}

const parallelRunners = getRunnerCount();

exports.config = {
    hostname: process.env.DOCKER ? 'selenium' : 'localhost',
    port: 4444,

    specs: specs,
    exclude: [
        './e2e/specs/accessibility/*.spec.js'
    ],

    maxInstances: parallelRunners,

    capabilities: [selectedBrowser],

    logLevel: argv.logLevel ? argv.logLevel : 'silent',

    deprecationWarnings: true,

    bail: 0,

    baseUrl: process.env.REACT_APP_APP_ROOT,

    waitforTimeout: process.env.DOCKER || process.env.BROWSERSTACK_USERNAME ? 30000 : 10000,

    connectionRetryTimeout: 90000,

    connectionRetryCount: 3,

    services: [],

    framework: 'jasmine',

    reporters: selectedReporters,

    jasmineNodeOpts: {
        // A test will timeout after 8 min
        defaultTimeoutInterval: 60000 * 8,
        //
        // The Jasmine framework allows interception of each assertion in order to log the state of the application
        // or website depending on the result. For example, it is pretty handy to take a screenshot every time
        // an assertion fails.
        expectationResultHandler: function(passed, assertion) {
            // do something
        }
    },

    /**
     * Gets executed once before all workers get launched.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     */
    onPrepare: function (config, capabilities) {
        generateCreds('./e2e/creds.js', config, parallelRunners);
    },
    /**
     * Gets executed just before initialising the webdriver session and test framework. It allows you
     * to manipulate configurations depending on the capability or spec.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    // beforeSession: function (config, capabilities, specs) {
    // },
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that are to be run
     */
    before: function (capabilities, specs) {
        require('@babel/register');
        browserCommands();

        if (browser.options.requestedCapabilities.jsonwpCaps.browserName.includes('chrome')) {
            browser.setTimeouts('page load', process.env.DOCKER ? 30000 : 20000);
        }

        if (browser.options.requestedCapabilities.jsonwpCaps.browserName.includes('edge')) {
            browser.windowHandleMaximize();
        }

        const testCreds = checkoutCreds('./e2e/creds.js', specs[0]);
        login(testCreds.username, testCreds.password, './e2e/creds.js');
    },
    /**
     * Runs before a WebdriverIO command gets executed.
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     */
    // beforeCommand: function (commandName, args) {
    // },

    /**
     * Hook that gets executed before the suite starts
     * @param {Object} suite suite details
     */
    // beforeSuite: function (suite) {
    // },
    /**
     * Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
     * @param {Object} test test details
     */
    // beforeTest: function (test) {
    // },
    /**
     * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
     * beforeEach in Mocha)
     */
    // beforeHook: function () {
    // },
    /**
     * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
     * afterEach in Mocha)
     */
    // afterHook: function () {
    // },
    /**
     * Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
     * @param {Object} test test details
     */
    afterTest: function (test) {
        if (test.error !== undefined) {
            browser.takeScreenshot();
        }
    },
    /**
     * Hook that gets executed after the suite has ended
     * @param {Object} suite suite details
     */
    // afterSuite: function (suite) {
    // },

    /**
     * Runs after a WebdriverIO command gets executed
     * @param {String} commandName hook command name
     * @param {Array} args arguments that command would receive
     * @param {Number} result 0 - command success, 1 - command error
     * @param {Object} error error object if any
     */
    // afterCommand: function (commandName, args, result, error) {
    // },
    /**
     * Gets executed after all tests are done. You still have access to all global variables from
     * the test.
     * @param {Number} result 0 - test pass, 1 - test fail
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    after: function (result, capabilities, specs) {
        checkInCreds('./e2e/creds.js', specs[0]);
    },
    /**
     * Gets executed right after terminating the webdriver session.
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs List of spec file paths that ran
     */
    //afterSession: function (config, capabilities, specs) {
    //},
    /**
     * Gets executed after all workers got shut down and the process is about to exit.
     * @param {Object} exitCode 0 - success, 1 - fail
     * @param {Object} config wdio configuration object
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {<Object>} results object containing test results
     */
    onComplete: function(exitCode, config, capabilities, results) {
        JSON.parse(readFileSync('./e2e/creds.js')).forEach((cred) => {
            deleteAllData(cred.token,cred.username);
        });
    }
}
