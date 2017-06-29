/***********************************************************************************************************************
 *
 * APPLICATION CONFIG
 *
 * @type {Node.js}
 *
 * main configuration file for server and buld scripts.
 * this file does NOT include sensitive information and can be safely committed to git.
 * sensitive information is found in .env
 *
 **********************************************************************************************************************/
const path = require("path");
const fs = require("fs-extra");
const moment = require("moment");
const pkg = require("../package.json");

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
moment.locale("de");

module.exports = {
    projectRoot: appDirectory,
    appFolder: path.join(appDirectory, "client"),
    buildDir: path.join(appDirectory, "server", "public", "assets"),

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
    pugScriptInclude: path.join(
        appDirectory,
        "server",
        "app",
        "views",
        "webpack.includes"
    ),

    webPackPort: 8000, // make sure this is different from the node server port.

    // webpack chunk entrypoints
    chunks: {
        app: path.join(appDirectory, "client", "app.js")
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
    jestCoverageDir: path.join(appDirectory, "coverage"),

    paths: {
        css: {
            in: [path.join(appDirectory, "client", "theme", "styles.scss")],
            out: path.join(appDirectory, "server", "public", "assets"),
            lint: path.join(appDirectory, "client", "theme", "**/*.scss"),
            styleLintRc: path.join(appDirectory, "config", ".stylelintrc.json")
        },
        fonts: {
            in: [path.join(appDirectory, "client", "theme", "fonts", "**/*")],
            out: path.join(appDirectory, "server", "public", "assets", "fonts")
        },
        images: {
            in: [path.join(appDirectory, "client", "theme", "images", "**/*")],
            out: path.join(appDirectory, "server", "public", "assets", "images")
        },
        icons: {
            in: [path.join(appDirectory, "client", "theme", "icons", "**/*")],
            out: path.join(appDirectory, "server", "public", "assets", "icons")
        }
    }
};
