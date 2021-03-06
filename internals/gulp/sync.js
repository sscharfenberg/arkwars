/***********************************************************************************************************************
 *
 * SYNC STATIC FILES FROM CLIENT TO SERVER
 * @type {Gulp}
 *
 **********************************************************************************************************************/
const gulp = require("gulp"); // https://www.npmjs.com/package/gulp
const imagemin = require("gulp-imagemin"); // https://www.npmjs.com/package/gulp-imagemin
const imageminMozjpeg = require("imagemin-mozjpeg"); // https://www.npmjs.com/package/imagemin-mozjpeg
const livereload = require("gulp-livereload"); // https://www.npmjs.com/package/gulp-livereload
const newer = require("gulp-newer"); // https://www.npmjs.com/package/gulp-newer
const notify = require("gulp-notify"); // https://www.npmjs.com/package/gulp-notify
const plumber = require("gulp-plumber"); // https://www.npmjs.com/package/gulp-plumber
const size = require("gulp-size"); // https://www.npmjs.com/package/gulp-size
const run = require("run-sequence").use(gulp); // https://www.npmjs.com/package/run-sequence
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../utils/clientlogger");
const config = require("../config");

/*
 * copy all static resources to /public/assets
 */
gulp.task("build:static", function(callback) {
    return run(
        ["sync:fonts", "sync:images", "app:icons", "game:icons", "styles:build"],
        callback
    );
});

/*
 * compile svg spritesheet from SVGs in "/client/theme/fonts/"
 */
gulp.task("sync:fonts", function() {
    console.log();
    logger.info(`[gulp] syncing ${chalk.blue("fonts")} to build dir.\n`);

    return (gulp
        .src(config.paths.fonts.in)
        .pipe(
            plumber({
                errorHandler: notify.onError("<%= error.message %>")
            })
        )
        .pipe(newer(config.paths.fonts.out))
        .pipe(gulp.dest(config.paths.fonts.out))
        .pipe(
            size({
                title: "FONT -",
                showFiles: true // comment this out if it becomes too verbose.
            })
        )
        .pipe(livereload()) );
});

/*
 * compile svg spritesheet from SVGs in "client/game/common/Icon/"
 */
gulp.task("sync:images", function() {
    console.log();
    logger.info(`[gulp] syncing ${chalk.blue("images")} to build dir.\n`);

    return (gulp
        .src(config.paths.images.in)
        .pipe(
            plumber({
                errorHandler: notify.onError("<%= error.message %>")
            })
        )
        .pipe(newer(config.paths.images.out))
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imageminMozjpeg({
                    quality: 85
                }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        {removeTitle: false},
                        {cleanupIDs: false}
                    ]
                })
            ])
        )
        .pipe(gulp.dest(config.paths.images.out))
        .pipe(
            size({
                title: "IMG -",
                showFiles: true // comment this out if it becomes too verbose.
            })
        )
        .pipe(livereload()) );
});
