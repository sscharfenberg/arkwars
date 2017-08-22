/***********************************************************************************************************************
 *
 * CREATE SVG SPRITESHEET
 * @type {Gulp}
 *
 **********************************************************************************************************************/
const gulp = require("gulp"); // https://www.npmjs.com/package/gulp
const flatten = require("gulp-flatten"); // https://www.npmjs.com/package/gulp-flatten
const imagemin = require("gulp-imagemin"); // https://www.npmjs.com/package/gulp-imagemin
const svgstore = require("gulp-svgstore"); // https://www.npmjs.com/package/gulp-svgstore
const livereload = require("gulp-livereload"); // https://www.npmjs.com/package/gulp-livereload
const notify = require("gulp-notify"); // https://www.npmjs.com/package/gulp-notify
const plumber = require("gulp-plumber"); // https://www.npmjs.com/package/gulp-plumber
const rename = require("gulp-rename"); // https://www.npmjs.com/package/gulp-rename
const size = require("gulp-size"); // https://www.npmjs.com/package/gulp-size
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../utils/clientlogger");
const config = require("../config");

/*
 * copy SVGs from /client/theme/icons/ as spritesheet to /server/public/assets/icons/sprite.svg
 */
gulp.task("icons", () => {
    console.log();
    logger.info(
        `[gulp] creating SVG spritesheet for ${chalk.blue("icons")}.\n`
    );

    return gulp
        .src(config.paths.icons.in)
        .pipe(
            plumber({
                errorHandler: notify.onError("<%= error.message %>")
            })
        )
        .pipe(flatten())
        .pipe(
            imagemin([
                imagemin.svgo({
                    plugins: [
                        {removeTitle: true}
                    ]
                })
            ])
        )
        .pipe(svgstore())
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest(config.paths.icons.out))
        .pipe(
            size({
                title: "SVG icon spritesheet generated."
            })
        )
        .pipe(livereload());
});
