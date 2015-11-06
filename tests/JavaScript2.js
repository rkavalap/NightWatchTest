module.exports = {
    tags: ["P0"],
    'step one': function (browser) {
        browser
            .url('http://www.google.com')
            .end();       
    }
};