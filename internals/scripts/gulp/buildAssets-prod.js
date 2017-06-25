/***********************************************************************************************************************
 *
 * BUILD ALL PRODUCTION ASSETS
 * @type {Gulp}
 *
 **********************************************************************************************************************/
const gulp = require("gulp"); // https://www.npmjs.com/package/gulp
const run = require("run-sequence").use(gulp); // https://www.npmjs.com/package/run-sequence
const cleanup = require("../cleanup");

/*
 * copy all static resources to /public/assets
 */
gulp.task("build:prod", function(callback) {
    cleanup();

    require("../js.prod");

    return run(["sync:all", "styles:build"], callback);
});
