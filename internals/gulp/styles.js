/***********************************************************************************************************************
 *
 * LINT SCSS, BUILD CSS
 * @type {Gulp}
 *
 **********************************************************************************************************************/
const gulp = require("gulp"); // https://www.npmjs.com/package/gulp
const autoprefixer = require("autoprefixer"); // https://www.npmjs.com/package/autoprefixer
const cached = require("gulp-cached"); // https://www.npmjs.com/package/gulp-cached
const notify = require("gulp-notify"); // https://www.npmjs.com/package/gulp-notify
const plumber = require("gulp-plumber"); // https://www.npmjs.com/package/gulp-plumber
const postcss = require("gulp-postcss"); // https://www.npmjs.com/package/gulp-postcss
const livereload = require("gulp-livereload"); // https://www.npmjs.com/package/gulp-livereload
const postcssFlexBugs = require("postcss-flexbugs-fixes"); // https://github.com/luisrudge/postcss-flexbugs-fixes
const postcssBanner = require("postcss-banner"); // https://www.npmjs.com/package/postcss-banner
const postcssNano = require("cssnano"); // http://cssnano.co/
//const rename = require("gulp-rename"); // https://www.npmjs.com/package/gulp-rename
const sass = require("gulp-sass"); // https://www.npmjs.com/package/gulp-sass
const size = require("gulp-size"); // https://www.npmjs.com/package/gulp-size
const styleLint = require("gulp-stylelint"); // https://stylelint.io/
const sourcemaps = require("gulp-sourcemaps"); // https://www.npmjs.com/package/gulp-sourcemaps
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../utils/clientlogger");
const config = require("../config");

/*
 * lints scss via style-lint
 * https://stylelint.io/
 * https://stylelint.io/user-guide/rules/
 */
gulp.task("styles:lint", function() {
    logger.info(`[gulp] starting ${chalk.blue("style-lint")}.`);

    return gulp
        .src(config.paths.css.lint)
        .pipe(
            plumber({
                errorHandler: notify.onError("<%= error.message %>")
            })
        )
        .pipe(cached("styleLint"))
        .pipe(
            styleLint({
                configFile: config.paths.css.styleLintRc,
                reporters: [{ formatter: "verbose", console: true }]
            })
        )
        .pipe(
            size({
                title: "linting done."
            })
        )
        .pipe(livereload());
});

/*
 * compiles SCSS stylesheets to CSS, autoprefixer, minify, header, sourcemap
 */
gulp.task("styles:build", ["styles:lint"], function() {
    // css banner has no webpack hash/chunkhash, so lets filter them out.
    let banner = config.banner.split("\n");
    banner = banner.filter(line => {
        return !(line.includes("@hash") || line.includes("@chunkHash"));
    });
    logger.info(`[gulp] compiling ${chalk.blue("css")}.\n`);

    return gulp
        .src(config.paths.css.in)
        .pipe(
            plumber({
                errorHandler: notify.onError("<%= error.message %>")
            })
        )
        .pipe(sourcemaps.init())
        .pipe(
            sass({
                precision: 6,
                onError: console.error.bind(console, "Sass error:"),
                sourceMap: true,
                includePaths: ["node_modules"],
                outputStyle: "compressed"
            })
        )
        .pipe(
            postcss([
                autoprefixer({ browsers: config.browsers }),
                postcssFlexBugs,
                postcssNano({
                    safe: true // set to true to experiment with more aggressive optimization
                }),
                postcssBanner({
                    banner: banner.join("\n"),
                    inline: false,
                    important: true
                })
            ])
        )
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest(config.paths.css.out))
        .pipe(
            size({
                title: "CSS -",
                showFiles: true
            })
        )
        .pipe(livereload());
});
