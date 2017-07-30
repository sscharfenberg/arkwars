/***********************************************************************************************************************
 *
 * NODEMON
 *
 * @type {Node.js}
 *
 * This script starts our app, monitors the node task and restarts the task if files have changed
 * it is called directly via NPM
 *
 **********************************************************************************************************************/
const path = require("path"); // https://nodejs.org/api/path.html
const nodemon = require("nodemon"); // https://github.com/remy/nodemon
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("./handlers/logger/console");

const monitor = nodemon({
    script: path.join(__dirname, "start.js"),
    ext: "js json jsx pug",
    ignore: [
        "server/public/",
        "client/**/*",
        "internals/**/*",
        "node_modules",
        "packag*.json"
    ],
    verbose: true
});

monitor.on("start", () => {
    logger.success("[nodemon] server starting up.");
});

monitor.on("quit", () => {
    logger.warn("[nodemon] app has quit.");
    process.exit(0);
});

monitor.on("restart", files => {
    logger.debug(
        "[nodemon] app restarted due to\r\n" + chalk.yellow(files.toString())
    );
});

monitor.on("crash", () => {
    logger.error("[nodemon] app has crashed.");
});
