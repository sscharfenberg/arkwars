/***********************************************************************************************************************
 *
 * CLIENT CONFIG
 *
 * this file does NOT include sensitive information and can be safely committed to git.
 * sensitive information is found in .env
 *
 **********************************************************************************************************************/
const path = require("path");
const fs = require("fs-extra");
const moment = require("moment");
const pkg = require("../../package.json");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const PROJECTROOT = fs.realpathSync(process.cwd());
const APPFOLDER = path.join(PROJECTROOT, "client");
const BUILDDIR = path.join(PROJECTROOT, "server", "public", "assets");
moment.locale("de");

module.exports = {
    projectRoot: PROJECTROOT,
    appFolder: APPFOLDER,
    buildDir: BUILDDIR,

    // used by both client and server
    appTitle: pkg.app.name,
    browsers: pkg.browsers,

    // banner for js, css
    banner: `@name ${pkg.app.name}
@description ${pkg.app.description}
@version v${pkg.version}
@author ${pkg.author.name} <${pkg.author.email}>
@license ${pkg.license}
@compiled ${moment().format("dddd, DD.MM.YYYY HH:mm:ss")}
@hash [hash]
@chunkHash [chunkhash]

█▀▀▄░░░░░░░░░░░▄▀▀█
░█░░░▀▄░▄▄▄▄▄░▄▀░░░█
░░▀▄░░░▀░░░░░▀░░░▄▀
░░░░▌░▄▄░░░▄▄░▐▀▀
░░░▐░░█▄░░░▄█░░▌▄▄▀▀▀▀█
░░░▌▄▄▀▀░▄░▀▀▄▄▐░░░░░░█
▄▀▀▐▀▀░▄▄▄▄▄░▀▀▌▄▄▄░░░█
█░░░▀▄░█░░░█░▄▀░░░░█▀▀▀
░▀▄░░▀░░▀▀▀░░▀░░░▄█▀
░░░█░░░░░░░░░░░▄▀▄░▀▄
░░░█░░░░░░░░░▄▀█░░█░░█
░░░█░░░░░░░░░░░█▄█░░▄▀
░░░█░░░░░░░░░░░████▀
`,

    // folder for pug script includes. we need this because of hash names.
    pugScriptInclude: path.join(PROJECTROOT, "server", "views", "webpack"),

    webPackPort: 8000, // make sure this is different from the node server port.

    // webpack chunk entrypoints
    chunks: {
        app: path.join(PROJECTROOT, "client", "app.js")
    },

    // https://webpack.js.org/configuration/stats/
    webPackStats: {
        colors: true,
        modules: false, // Add built modules information
        children: false, // Add children information
        chunks: false, // Add chunk information (setting this to `false` allows for a less verbose output)
        chunkModules: false, // Add built modules information to chunk information
        entrypoints: true, // Display the entry points with the corresponding bundles
        publicPath: false,
        timings: true // Add timing information
    },

    // directory with jest coverage reports
    jestCoverageDir: path.join(PROJECTROOT, "coverage"),

    paths: {
        css: {
            in: [path.join(PROJECTROOT, "client", "theme", "*.scss")],
            out: BUILDDIR,
            lint: path.join(PROJECTROOT, "client", "theme", "**/*.scss"),
            styleLintRc: path.join(
                PROJECTROOT,
                "internals",
                "config",
                ".stylelintrc.json"
            )
        },
        fonts: {
            in: [path.join(PROJECTROOT, "client", "theme", "fonts", "**/*")],
            out: path.join(BUILDDIR, "fonts")
        },
        images: {
            in: [path.join(PROJECTROOT, "client", "theme", "images", "**/*")],
            out: path.join(BUILDDIR, "images")
        },
        icons: {
            in: [path.join(PROJECTROOT, "client", "theme", "icons", "**/*")],
            out: path.join(BUILDDIR, "images")
        },
        cleanup: ["server/public/assets/**/*", "server/views/webpack/**/*"]
    }
};
