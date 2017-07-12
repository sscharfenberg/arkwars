/***********************************************************************************************************************
 *
 * BUILD CLIENT PRODUCTION ASSETS
 *
 * @type {Node.js}
 *
 **********************************************************************************************************************/
const fs = require("fs-extra"); // https://www.npmjs.com/package/fs-extra
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../utils/clientlogger");
const config = require("../../config");

const cleanup = () => {
    // build dir with with webpack-generated assets
    fs.emptyDirSync(config.buildDir);
    logger.info(
        `[node] emptied assets directory:\n${chalk.yellow(config.buildDir)}`
    );

    // directory with webpack-generated pug script includes
    fs.emptyDirSync(config.pugScriptInclude);
    logger.info(
        `[node] emptied pug script include template directory:\n${chalk.yellow(
            config.pugScriptInclude
        )}`
    );

    fs.emptyDirSync(config.jestCoverageDir);
    logger.info(
        `[node] emptied jest coverage directory:\n${chalk.yellow(
            config.jestCoverageDir
        )}`
    );

    logger.debug("[todo] add database cleanup");
};

module.exports = cleanup();
