/***********************************************************************************************************************
 *
 * cleanup generated files
 *
 **********************************************************************************************************************/
const gulp = require("gulp"); // https://www.npmjs.com/package/gulp
const del = require("del"); // https://www.npmjs.com/package/del
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const config = require("../config");
const logger = require("../utils/clientlogger");

gulp.task("cleanup", function() {
    return del(config.paths.cleanup).then(paths => {
        logger.debug("Deleted files and folders:");
        console.log(chalk.red(paths.join("\n")));
    });
});
