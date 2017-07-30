/***********************************************************************************************************************
 *
 * APPLICATION CONFIG
 *
 * @type {Node.js}
 *
 * main configuration file. this file does NOT include sensitive information and can be safely committed to git.
 * sensitive information is found in .env
 * this config file is used by the server, not the client.
 *
 **********************************************************************************************************************/
const fs = require("fs-extra");
const pkg = require( "../../package.json" );

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());

const appConfig = {
    app: {
        title: pkg.app.name
        , projectDir: appDirectory
        , browsers: pkg.browsers
        , email: {
            from: `${pkg.app.name} <noreply@arkwars.io>`
        }
        , locales: ["en", "de"]
        , blacklistedUsernames: [
            "ash",
            "ashaltiriak",
            "admin",
            "administrator",
            "system",
            "owner",
            "mod",
            "moderator",
            "root",
            "superuser",
            "sudo",
            "database"
        ]
    }
};

module.exports = appConfig;
