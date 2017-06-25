/***********************************************************************************************************************
 *
 * WEBPACK DEVELOPMENT CONFIG
 *
 * @type {Node.js}
 * @exports {object} webpackConfig
 *
 **********************************************************************************************************************/
const webpack = require("webpack"); // https://webpack.js.org/
const merge = require("webpack-merge"); // https://www.npmjs.com/package/webpack-merge
const baseWebpackConfig = require("./config.base"); // base webpack config
const config = require("../config");

let webpackConfig = merge(baseWebpackConfig, {
    // https://webpack.js.org/configuration/devtool/
    // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
    // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
    devtool: "cheap-module-source-map",

    // https://webpack.js.org/configuration/output
    output: {
        publicPath: `http://localhost:${config.webPackPort}`,
        filename: "[name].js"
    },

    // https://webpack.js.org/configuration/plugins/
    // https://webpack.js.org/plugins/
    plugins: [
        // Define Plugin ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // https://webpack.js.org/plugins/define-plugin/
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            }
        }),

        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin()
    ]
});

module.exports = webpackConfig;
