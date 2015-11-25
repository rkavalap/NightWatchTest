/// <reference path="../typings/tsd.d.ts"/>

import {NightWatchBrowser} from "../typings/nightwatch/nightwatch";

module.exports = {
    tags: ["P0"],
    'step one': function (browser: NightWatchBrowser) {
        browser
            .url('http://www.google.com')
            .end();       
    }
};