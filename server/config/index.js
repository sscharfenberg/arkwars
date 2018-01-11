/***********************************************************************************************************************
 *
 * APPLICATION CONFIG
 *
 * @type {Node.js}
 *
 * main configuration file for the server.
 * this file does NOT include sensitive information and can be safely committed to git.
 * sensitive information is found in .env
 * this config file is used by the server, not the client.
 *
 **********************************************************************************************************************/
const fs = require("fs-extra");
const path = require("path"); // https://www.npmjs.com/package/path
const pkg = require("../../package.json");
const RULES_PLAYER = require("./rules/player");
const RULES_GAMES = require("./rules/games");
const RULES_STARS = require("./rules/stars");
const RULES_PLANETS = require("./rules/planets");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());

const appConfig = {
    app: {
        // basic settings
        title: pkg.app.name,
        projectDir: appDirectory,
        browsers: pkg.browsers,
        email: {
            from: `${pkg.app.name} <noreply@arkwars.io>`
        },
        // i18n base settings. the language files can be found in /server/lang/{locale].json
        // first locale is the default
        locales: [
            {
                name: "en",
                native: "English"
            },
            {
                name: "de",
                native: "Deutsch"
            }
        ],
        // blacklisted usernames. TODO: put in external file for ease of maintenance
        blacklistedUsernames: [
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
        ],
        // user settings
        username: {
            min: 3,
            max: 20
        },
        password: {
            min: 6,
            max: 32
        },
        avatar: {
            mimeTypes: [
                "image/png",
                "image/jpeg"
                //, "image/webp"
            ],
            maxFileSize: 200 * 1024, // 200Kb
            maxSize: {
                width: 192, // 96px 2dpi
                height: 192
            },
            path: path.join(appDirectory, "server", "public", "avatars")
        }
    },

    player: RULES_PLAYER,

    games: RULES_GAMES,

    stars: RULES_STARS,

    planets: RULES_PLANETS,

    defaultPagination: {
        admin: {
            users: 20,
            games: 20
        }
    }
};

module.exports = appConfig;
