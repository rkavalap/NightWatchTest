
var minimist = require('minimist');

var fs = require("fs-extra");

function generateUUID() {
     var d = new Date().getTime();
     var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
         var r = (d + Math.random() * 16) % 16 | 0;
         d = Math.floor(d / 16);
         return (c == "x" ? r : (r & 0x3 | 0x8)).toString(16);
     });
     return uuid;
};

function createDir(path) {
    fs.mkdirsSync(path, function (err) {
        if (err) {
            console.error(err);
        }
    });
}

var folderLogPath = "TestResults" + "\/" + generateUUID();
createDir(folderLogPath);

var globals = {
    
    // this will overwrite the default polling interval (currently 500ms) for waitFor commands
    // and expect assertions that use retry
    waitForConditionPollInterval : 300,
    
    // default timeout value in milliseconds for waitFor commands and implicit waitFor value for
    // expect assertions
    waitForConditionTimeout: 10000,

    // default timeout value in milliseconds for global beforeEach and afterEach methods.
    asyncHookTimeout: 90000,
    
    
    'default' : {
        myGlobal : function () {
            return 'I\'m a method';
        }
    },
    
    'test_env' : {
        myGlobal: 'test_global',
        beforeEach : function () {

        }
    },
    
    
    beforeEach : function (browser, cb) {
        console.log("In globals beforeEach");
        cb();
    },
    
    
    afterEach: function (browser, cb) {

        var slashIndex = (browser.currentTest.module.lastIndexOf("\/") > browser.currentTest.module.lastIndexOf("\\")) ? browser.currentTest.module.lastIndexOf("\/") : browser.currentTest.module.lastIndexOf("\\");
        var folderName = browser.currentTest.module.substring(0, slashIndex) + "/seleniumAndBrowserLogs";
        var seleniumAndBrowserLogPath = folderLogPath + "\/" + folderName;
        createDir(seleniumAndBrowserLogPath);

        var executingTestCaseName = browser.currentTest.module.substring(slashIndex, browser.currentTest.module.length);
        
        var seleniumLogPath = seleniumAndBrowserLogPath + "\/" + executingTestCaseName + "-selenium-driver.log";
        var browserLogPath = seleniumAndBrowserLogPath + "\/" + executingTestCaseName + "-browser.log";
        
        var log4js = require("log4js");
        log4js.configure({
            appenders: [
                { type: 'file', filename: seleniumLogPath, category: 'seleniumLogger', absolute: true, "layout": { "type": "messagePassThrough" } },
                { type: 'file', filename: browserLogPath, category: 'browserLogger', absolute: true, "layout": { "type": "messagePassThrough" } }
            ]
        });
        
        // Only write logs if there was a error / failure / skipped. 
        if ((browser.currentTest.results.errors > 0) || (browser.currentTest.results.failed > 0) || (browser.currentTest.results.skipped > 0)) {
            var seleniumLogger = log4js.getLogger("seleniumLogger");
            browser.getLog('driver', function(logEntriesArray) {
                console.log("LogEntriesArray: " + logEntriesArray);
                logEntriesArray.forEach(function(log) {
                    seleniumLogger.info(new Date(log.timestamp).toISOString() + '[' + log.level + '] ' + ' : ' + log.message);
                });
            });

            var browserLogger = log4js.getLogger("browserLogger");
            browser.getLog('browser', function(logEntriesArray) {
                console.log("LogEntriesArray: " + logEntriesArray);
                logEntriesArray.forEach(function(log) {
                    browserLogger.info(new Date(log.timestamp).toISOString() + '[' + log.level + '] ' + ' : ' + log.message);
                });
            });
        }

        browser.end();
        console.log("In globals afterEach");
        cb();
    }
};

module.exports = globals;