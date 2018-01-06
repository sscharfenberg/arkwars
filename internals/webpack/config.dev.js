/***********************************************************************************************************************
 *
 * WEBPACK DEVELOPMENT CONFIG
 *
 * @type {Node.js}
 * @exports {object} webpackConfig
 *
 **********************************************************************************************************************/
const path = require("path");
const webpack = require("webpack"); // https://webpack.js.org/
const merge = require("webpack-merge"); // https://www.npmjs.com/package/webpack-merge
const baseWebpackConfig = require("./config.base"); // base webpack config
// https://www.npmjs.com/package/html-webpack-harddisk-plugin
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
// https://github.com/JaKXz/stylelint-webpack-plugin
const StylelintPlugin = require("stylelint-webpack-plugin");
const cfg = require("../config");

let webpackConfig = merge(baseWebpackConfig, {
    // https://webpack.js.org/configuration/devtool/
    // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
    // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
    devtool: "cheap-module-source-map",

    // https://webpack.js.org/configuration/output
    output: {
        publicPath: `http://localhost:${cfg.webPackPort}/`,
        filename: "[name].js"
    },

    // https://webpack.js.org/configuration/plugins/
    // https://webpack.js.org/plugins/
    plugins: [
        // https://www.npmjs.com/package/html-webpack-harddisk-plugin
        // webpack-dev-server does not write to disk. use harddisk plugin to force write to disk
        // so we can update paths to webpack-dev-server js files in pug script include
        new HtmlWebpackHarddiskPlugin(),

        // https://webpack.js.org/plugins/define-plugin/
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("development")
            }
        }),

        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),

        // HMR shows correct file names in console on update.
        new webpack.NamedModulesPlugin(),

        new StylelintPlugin({
            files: ["**/*.vue"],
            syntax: "scss",
            reporters: [{ formatter: "verbose", console: true }],
            configFile: path.join(cfg.projectRoot, "internals", "config", ".stylelintrc")
        })
    ]
});

module.exports = webpackConfig;
