module.exports = {
    
    // this will overwrite the default polling interval (currently 500ms) for waitFor commands
    // and expect assertions that use retry
    waitForConditionPollInterval : 300,
    
    // default timeout value in milliseconds for waitFor commands and implicit waitFor value for
    // expect assertions
    waitForConditionTimeout : 10000,
    
    
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
    
    
    afterEach : function (browser, cb) {
        var executingTestCaseName = browser.currentTest.module.substring(browser.currentTest.module.lastIndexOf("\/") + 1, browser.currentTest.module.length);
        
        var seleniumLogPath = executingTestCaseName + "-selenium-driver.log";
        var browserLogPath = executingTestCaseName + "-browser.log";
        
        var log4js = require("log4js");
        log4js.configure({
            appenders: [
                { type: 'file', filename: seleniumLogPath, category: 'seleniumLogger', absolute: true, "layout": { "type": "messagePassThrough" } },
                { type: 'file', filename: browserLogPath, category: 'browserLogger', absolute: true, "layout": { "type": "messagePassThrough" } }
            ]
        });
        
        var seleniumLogger = log4js.getLogger("seleniumLogger");
        browser.getLog('driver', function (logEntriesArray) {
            console.log("LogEntriesArray: " + logEntriesArray);            
            logEntriesArray.forEach(function (log) {
                seleniumLogger.info(new Date(log.timestamp).toISOString() + '[' + log.level + '] ' + ' : ' + log.message);
            });
        });
        
        var browserLogger = log4js.getLogger("browserLogger");
        browser.getLog('browser', function (logEntriesArray) {
            console.log("LogEntriesArray: " + logEntriesArray);             
            logEntriesArray.forEach(function (log) {
                browserLogger.info(new Date(log.timestamp).toISOString() + '[' + log.level + '] ' + ' : ' + log.message);
            });
        });
        
        browser.end();
        console.log("In globals afterEach");
        cb();
    },
    
    
};