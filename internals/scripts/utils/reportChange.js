/***********************************************************************************************************************
 *
 * gulp.watch report change formatter
 * @type {Module}
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk

module.exports = event => {
    // only works on windows - i don't know enough about node globs on *x. feel free to PR!
    let pathArray = event.path.split("\\");
    console.log(
        chalk.yellow("File ") +
            chalk.blue(pathArray[pathArray.length - 1]) +
            chalk.yellow(" was ") +
            chalk.red(event.type.toUpperCase()) +
            chalk.yellow(", running tasks...")
    );
};
