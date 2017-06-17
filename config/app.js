/***********************************************************************************************************************
 *
 * APPLICATION CONFIG
 *
 * @type {Node.js}
 *
 * main configuration file. this file does NOT include sensitive information and can be safely committed to git.
 * sensitive information is found in .env
 *
 **********************************************************************************************************************/
const pkg = require( "../package.json" );
const appConfig = {
    "app": {
        "title": pkg.app.name
        , "browsers": pkg.browsers
    }
};

module.exports = appConfig;
