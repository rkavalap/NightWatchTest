/// <reference path="../typings/index.d.ts"/>

import NB = require("nightwatch/nightwatch");
declare var module:any;
module.exports = {
    tags: ["P0"],
    'step one': function (browser: NB.NightWatchBrowser) {
        browser
            .url('http://www.google.com')
            .end();       
    }
};