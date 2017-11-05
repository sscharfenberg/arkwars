/***********************************************************************************************************************
 *
 * WEBPACK PRODUCTION CONFIG
 *
 * @type {Node.js}
 * @exports {object} webpackConfig
 *
 **********************************************************************************************************************/
const path = require("path"); // https://www.npmjs.com/package/path
const webpack = require("webpack"); // https://webpack.js.org/
const merge = require("webpack-merge"); // https://www.npmjs.com/package/webpack-merge
// https://www.npmjs.com/package/compression-webpack-plugin
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// https://github.com/webpack-contrib/extract-text-webpack-plugin
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// https://www.npmjs.com/package/html-webpack-plugin
const HtmlWebpackPlugin = require("html-webpack-plugin");

const baseWebpackConfig = require("./config.base"); // base webpack config
const config = require("../config");

// import environmental variables from our .env file to process.env
require("dotenv").config({
    path: path.join(config.projectRoot, "server", "config", ".env")
});

let webpackConfig = merge(baseWebpackConfig, {
    // https://webpack.js.org/configuration/devtool/
    devtool: "source-map",

    // https://webpack.js.org/configuration/plugins/
    // https://webpack.js.org/plugins/
    plugins: [
        // Define Plugin
        // https://webpack.js.org/plugins/define-plugin/
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production") // This has effect on the library size
            }
        }),

        // UglifyJS Plugin
        // https://github.com/mishoo/UglifyJS2
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                dead_code: true // discard unreachable code
            },
            output: {
                comments: false
            },
            sourceMap: true
        }),

        new ExtractTextPlugin({
            filename: "[name].[chunkhash].css"
        }),

        // Compression Plugin - generates *.gz files
        // https://github.com/webpack-contrib/compression-webpack-plugin
        new CompressionWebpackPlugin({
            // The target asset name. [file] is replaced with the original asset. [path] is replaced with the path
            // of the original asset and [query] with the query. Defaults to "[path].gz[query]".
            asset: "[path].gz[query]",
            // A function(asset) which receives the asset name (after processing asset option)
            // and returns the new asset name. Defaults to false.
            filename: false,
            // Can be a function(buf, callback) or a string. For a string the algorithm
            // is taken from zlib (or zopfli for zopfli). Defaults to "gzip".
            algorithm: "gzip",
            //  All assets matching this RegExp are processed. Defaults to every asset.
            test: new RegExp("\\.(js|css|svg)$"),
            // Only assets bigger than this size are processed. In bytes. Defaults to 0.
            threshold: 4096,
            // Only assets that compress better that this ratio are processed. Defaults to 0.8.
            minRatio: 0.8,
            // Whether to delete the original assets or not. Defaults to false.
            deleteOriginalAssets: false
        }),

        // Banner Plugin
        // https://webpack.js.org/plugins/banner-plugin/
        new webpack.BannerPlugin({
            banner: config.banner,
            // if true, banner will not be wrapped in a comment
            raw: false,
            // if true, the banner will only be added to the entry chunks
            entryOnly: true
        }),

    ]
});

// HTML Webpack Plugin
// prod extracts styles to css file and we need the header include with content hash
// https://github.com/jantimon/html-webpack-plugin
const invalidChunks = ["admin", "app"]; // non-Vue chunks that do not need to extract css
const validChunks = Object.keys(config.chunks).filter(chunk => !invalidChunks.includes(chunk));
validChunks.forEach( chunk => {
    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: path.join(
                config.projectRoot,
                "internals",
                "webpack",
                "templates",
                `${chunk}.header.ejs`
            ),
            filename: path.join(
                config.projectRoot,
                "server",
                "views",
                "webpack",
                `${chunk}.header.pug`
            ),
            showErrors: true,
            inject: false,
            alwaysWriteToDisk: true
        })
    );
});

module.exports = webpackConfig;
