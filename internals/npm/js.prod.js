/***********************************************************************************************************************
 *
 * BUILD CLIENT PRODUCTION ASSETS
 *
 * @type {Node.js}
 *
 **********************************************************************************************************************/
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

//const fs = require("fs-extra"); // https://www.npmjs.com/package/fs-extra
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const webpack = require("webpack"); // https://www.npmjs.com/package/webpack
const webpackConfig = require("../webpack/config.prod");
const logger = require("../utils/clientlogger");
const config = require("../config");

logger.debug(`[node] preparing client assets for ${chalk.yellow(process.env.NODE_ENV.toUpperCase())}`);

webpack(webpackConfig, (err, stats) => {
    if (err) {
        throw err;
    } else {
        process.stdout.write(stats.toString(config.webPackStats) + "\n");
        logger.debug("[webpack] done.");
        logger.success(`[webpack] site is now in ${chalk.yellow(process.env.NODE_ENV.toUpperCase())} mode.`);
        logger.info("[webpack] css is served via local, app-served static files.");
    }
});
