/***********************************************************************************************************************
 *
 * Monitor Cron Task
 *
 * @type {Node.js}
 *
 * This script starts the cron server, monitors the node task and restarts the task if files have changed or a crash occured
 * it is called directly via NPM
 *
 **********************************************************************************************************************/
const path = require("path"); // https://nodejs.org/api/path.html
const nodemon = require("nodemon"); // https://github.com/remy/nodemon
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("./handlers/logger/console");

const monitor = nodemon({
    script: path.join(__dirname, "cron.js"),
    ext: "js json",
    watch: ["server/cron", "server/models", "server/handlers"],
    ignore: [],
    verbose: true
});

monitor
    .on("start", () => {
        logger.info("[nodemon] cron server starting up.");
    })
    .on("quit", () => {
        logger.warn("[nodemon] cron server has shut down.");
        process.exit(0);
    })
    .on("restart", files => {
        logger.debug(
            "[nodemon] cron server restarted due to\r\n" +
                chalk.yellow(files.toString())
        );
    })
    .on("crash", () => {
        logger.error("[nodemon] cron server has crashed.");
        process.exit(0);
    });
