/***********************************************************************************************************************
 *
 * START DEVELOPMENT
 * @type {Gulp}
 *
 **********************************************************************************************************************/
const gulp = require("gulp"); // https://www.npmjs.com/package/gulp
const run = require("run-sequence").use(gulp); // https://www.npmjs.com/package/run-sequence
const livereload = require("gulp-livereload"); // https://www.npmjs.com/package/gulp-livereload
const config = require("../../config");
const reportChange = require("../utils/reportChange");
const cleanup = require("../cleanup");

/*
 * copy all static resources to /public/assets
 */
gulp.task("watch", function() {
    // delete generated files
    cleanup();

    // copy assets to server dir
    run(["sync:all", "styles:build"]);

    // gulp.watch
    gulp
        .watch(config.paths.css.lint, ["styles:build"])
        .on("change", reportChange);

    // do initial webpack compilation and start webpack-dev-server
    require("../js.dev");

    return livereload.listen({
        quiet: true
    });
});
