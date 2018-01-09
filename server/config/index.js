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

    games: {
        empire: {
            name: {
                bounds: [6, 32]
            },
            ticker: {
                bounds: [2, 5]
            }
        },
        turns: {
            // server tick threshold for game turn processing.
            // game turns that are due in (threshold) are processed
            dueThreshold: 30 * 1000
        },
        defaultTurnDuration: 15,
        dimensions: {
            default: 40,
            min: 10,
            max: 200
        },
        distance: {
            default: [3, 5],
            bounds: [2, 20]
        },
        playerDistance: {
            default: [6, 12],
            bounds: [2, 20]
        }
    },

    stars: {
        spectralTypes: [
            {
                name: "O",
                chance: 5,
                chanceHome: 0,
                planetsMod: -3
            },
            {
                name: "B",
                chance: 5,
                chanceHome: 0,
                planetsMod: -2
            },
            {
                name: "A",
                chance: 5,
                chanceHome: 10,
                planetsMod: -2
            },
            {
                name: "F",
                chance: 10,
                chanceHome: 30,
                planetsMod: 0
            },
            {
                name: "G",
                chance: 20,
                chanceHome: 30,
                planetsMod: 2
            },
            {
                name: "K",
                chance: 20,
                chanceHome: 30,
                planetsMod: 1
            },
            {
                name: "M",
                chance: 30,
                chanceHome: 0,
                planetsMod: 0
            },
            {
                name: "Y",
                chance: 5,
                chanceHome: 0,
                planetsMod: -2
            }
        ],
        name: {
            initial: [4, 6], // range for initially generated names
            // this needs to be synced with /client/game/Empire/Stars/Star.vue
            bounds: [4, 40] // range for player edited names
        },
        planets: {
            npc: [3, 10], // range for numplanets in npc systems
            player: [6, 12] // range for numplanets in player systems
        }
    },

    planets: {
        types: [
            {
                name: "terrestrial",
                chance: 20,
                chanceHome: 50
            },
            {
                name: "gas",
                chance: 17,
                chanceHome: 10
            },
            {
                name: "ice",
                chance: 16,
                chanceHome: 10
            },
            {
                name: "iron",
                chance: 20,
                chanceHome: 10
            },
            {
                name: "desert",
                chance: 30,
                chanceHome: 10
            },
            {
                name: "toxic",
                chance: 5,
                chanceHome: 5
            },
            {
                name: "carbon",
                chance: 2,
                chanceHome: 5
            }
        ]
    },

    defaultPagination: {
        admin: {
            users: 20,
            games: 20
        }
    }
};

module.exports = appConfig;
