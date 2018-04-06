/***********************************************************************************************************************
 *
 * START CLIENT DEV SERVER
 *
 * @type {Node.js}
 *
 **********************************************************************************************************************/
// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
//const fs = require("fs"); // https://nodejs.org/api/path.html
const webpack = require("webpack"); // https://www.npmjs.com/package/webpack
const WebpackDevServer = require("webpack-dev-server"); // https://webpack.js.org/configuration/dev-server/
const webpackConfig = require("../webpack/config.dev");
const logger = require("../utils/clientlogger");
const config = require("../config");
let compiler = webpack(webpackConfig);
let initialCompile = true;
//const httpsOptions = {
//    key: fs.readFileSync( "./server/config/https/localhost.key" ),
//    cert: fs.readFileSync( "./server/config/https/localhost.cert" ),
//    requestCert: false,
//    rejectUnauthorized: false
//};

// https://webpack.js.org/configuration/dev-server/
// start the dev server
let devServer = new WebpackDevServer(compiler, {
    proxy: {
        // https://webpack.js.org/configuration/dev-server/#devserver-proxy
        "*": `http://localhost:${config.webPackPort}`
    },
    headers: {
        // https://webpack.js.org/configuration/dev-server/#devserver-headers-
        "X-Powery-By": "Webpack Dev Server"
    },
    hot: true, // https://webpack.js.org/configuration/dev-server/#devserver-hot
    compress: true, // https://webpack.js.org/configuration/dev-server/#devserver-compress
    quiet: false, // https://webpack.js.org/configuration/dev-server/#devserver-quiet-
    //overlay: false, // https://webpack.js.org/configuration/dev-server/#devserver-overlay
    stats: config.webPackStats
    //host: "localhost",
    //port: config.webPackPort,
    //https: httpsOptions // https://webpack.js.org/configuration/dev-server/#devserver-https
});

// serve files on webPackPort
devServer.listen(config.webPackPort, "localhost", err => {
    if (err) throw err;
    logger.debug(`[webpack] now serving files on port ${chalk.yellow(config.webPackPort)}.`);
    logger.success(`[webpack] site is now in ${chalk.yellow(process.env.NODE_ENV.toUpperCase())} mode.`);
    logger.info("[webpack] css is served via webpack-dev-server injected as style blob into head.");
});

// log finished compilations to console
compiler.plugin("done", () => {
    logger.debug(`[webpack] ${initialCompile ? "initial" : "change"} compilation done:`);
    initialCompile = false;
});
