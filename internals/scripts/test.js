/***********************************************************************************************************************
 *
 * START CLIENT DEV SERVER
 *
 * @type {Node.js}
 *
 **********************************************************************************************************************/
"use strict";

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "test";
process.env.NODE_ENV = "test";
process.env.PUBLIC_URL = "";

const path = require("path"); // https://www.npmjs.com/package/path
const jest = require("jest"); // https://facebook.github.io/jest/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("./utils/clientlogger");
const config = require("../config");
const argv = process.argv.slice(2);

logger.info(
    `[jest] starting tests in ${chalk.yellow(
        process.env.NODE_ENV.toUpperCase()
    )} environment.`
);

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", err => {
    throw err;
});

if (argv.indexOf("--coverage") > -1) {
    let coverageReportUrl = path.join(
        config.projectRoot,
        "coverage",
        "lcov-report",
        "index.html"
    );
    logger.info(
        `[jest] created Code coverage report for all files\n${chalk.yellow(
            coverageReportUrl
        )}`
    );
}

jest.run(argv);
