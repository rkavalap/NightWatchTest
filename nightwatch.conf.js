//
// Script to compose nightwatch configuration from ./configs/**.json5?
//
// Usage: nightwatch -c path/to/this/file
//

require("json5/lib/require"); // http://json5.org/

var fs = require("fs"),
    resolve = require("path").resolve,
    extend = require("lodash/object/extend"),
    configs;

var isWindows = require('os').platform().substring(0, 3) === 'win',
    SUFFIX = isWindows ? '.cmd' : '';


// Load .js, .json, or .json5 file, or die trying.
function checkConfigPath(pathname) {

    try {
        return require(pathname);
    }
    catch (err) {
        console.error("Error loading config, check:", pathname);
        console.error(err);
        process.exit(9);
    }
}

// Make a new nightwatch "environment" for each combination of env/build and selenium/web-driver host config.
function mergeDeploymentAndCapabilitiesJson() {

    Object.keys(deployments).forEach(function (deploymentDictionaryKey) {

        Object.keys(capabilities).forEach(function (capabiltiesDictionaryKey) {

            var combined = extend({}, deployments[deploymentDictionaryKey], capabilities[capabiltiesDictionaryKey]);
            configs.test_settings[deploymentDictionaryKey + "-" + capabiltiesDictionaryKey] = combined;

        });
    });
}

// Import configs from ./environments/* into a settings object.
function doEnvironments(dirname) {

    var fileExtensionRegex = /[.](?:js|json5?)$/i;

    function isJson(file) {
        return file.match(fileExtensionRegex);
    }

    function saveSetting(filename) {
        var key = filename.replace(fileExtensionRegex, "").toLowerCase(),
            val = checkConfigPath(resolve(dirname, filename));

        Object.keys(capabilities).forEach(function (capability) {
            configs.test_settings[key + "-" + capability] = extend(configs.test_settings[key + "-" + capability] || {}, val);
        });

    }

    fs.readdirSync(dirname)
        .filter(isJson)
        .forEach(saveSetting);
}


//  main  //

configs = checkConfigPath("./configs/defaults");

deployments = checkConfigPath("./configs/deployments");

capabilities = checkConfigPath("./configs/capabilities");

capabilities["localchrome"].selenium.cli_args["webdriver.chrome.driver"] += SUFFIX;

mergeDeploymentAndCapabilitiesJson();

doEnvironments(resolve(__dirname, "configs/TestConfigData"));

module.exports = configs;
