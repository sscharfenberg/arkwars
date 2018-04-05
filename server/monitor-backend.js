/***********************************************************************************************************************
 *
 * Monitor Backend
 *
 * @type {Node.js}
 *
 * This script starts our app, monitors the node task and restarts the task if files have changed or a crash occured
 * it is called directly via NPM
 *
 **********************************************************************************************************************/
const path = require("path"); // https://nodejs.org/api/path.html
const nodemon = require("nodemon"); // https://github.com/remy/nodemon
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("./handlers/logger/console");

const monitor = nodemon({
    script: path.join(__dirname, "start.js"),
    ext: "js,json",
    watch: [
        "server/controllers",
        "server/config",
        "server/handlers",
        "server/lang",
        "server/models",
        "server/routes",
        "shared",
        "client/lang"
    ],
    verbose: true
});

monitor
    .on("start", () => {
        logger.info("[nodemon] backend server starting up.");
    })
    .on("quit", () => {
        logger.warn("[nodemon] backend server has shut down.");
        process.exit(0);
    })
    .on("restart", files => {
        logger.debug("[nodemon] backend server restarted due to\r\n" + chalk.yellow(files.toString()));
    })
    .on("crash", () => {
        logger.error("[nodemon] backend server has crashed.");
    });
