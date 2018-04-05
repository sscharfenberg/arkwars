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
// https://www.npmjs.com/package/webpack-bundle-analyzer
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
// https://www.npmjs.com/package/compression-webpack-plugin
const CompressionWebpackPlugin = require("compression-webpack-plugin");
// https://github.com/webpack-contrib/extract-text-webpack-plugin
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// https://www.npmjs.com/package/imagemin-webpack-plugin
const ImageminPlugin = require("imagemin-webpack-plugin").default;
//https://github.com/webpack-contrib/uglifyjs-webpack-plugin
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// https://github.com/imagemin/imagemin-mozjpeg
const imageminMozjpeg = require("imagemin-mozjpeg");
// https://www.npmjs.com/package/webpack-manifest-plugin
const ManifestPlugin = require("webpack-manifest-plugin");
const baseWebpackConfig = require("./config.base"); // base webpack config
const config = require("../config");

// import environmental variables from our .env file to process.env
require("dotenv").config({
    path: path.join(config.projectRoot, "server", "config", ".env")
});

let webpackConfig = merge(baseWebpackConfig, {

    // production enables all kind of optimizations to generate optimized bundles
    mode: "production",

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

        // https://github.com/Klathmon/imagemin-webpack-plugin
        // match options to /internals/gulp/sync.js
        new ImageminPlugin({
            gifsicle: {interlaced: true},
            optipng: {optimizationLevel: 5},
            svgo: {plugins:[]}, // https://github.com/svg/svgo#what-it-can-do
            jpegtran: null, // set to null to disable jpegtran
            plugins: [
                // https://github.com/imagemin/imagemin-mozjpeg
                imageminMozjpeg({
                    quality: 65, // 65 is quite low, watch for image quality
                    progressive: true
                })
            ]
        }),

        new ExtractTextPlugin({
            filename: "[name].[chunkhash].css"
        }),

        // https://github.com/webpack-contrib/uglifyjs-webpack-plugin
        new UglifyJsPlugin({
            uglifyOptions: {
                ie8: false,
                ecma: 8,
                mangle: {
                    keep_fnames: true
                },
                output: {
                    comments: false,
                    beautify: false,
                    safari10: true
                },
                compress: {
                    warnings: true,
                    dead_code: true // discard unreachable code
                },
                warnings: false
            }
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

        // https://www.npmjs.com/package/webpack-bundle-analyzer
        new BundleAnalyzerPlugin({
            // Can be `server`, `static` or `disabled`.
            // In `server` mode analyzer will start HTTP server to show bundle report.
            // In `static` mode single HTML file with bundle report will be generated.
            // In `disabled` mode you can use this plugin to just generate Webpack Stats JSON file by setting `generateStatsFile` to `true`.
            analyzerMode: "static",
            // Host that will be used in `server` mode to start HTTP server.
            //analyzerHost: "127.0.0.1",
            // Port that will be used in `server` mode to start HTTP server.
            //analyzerPort: 8888,
            // Path to bundle report file that will be generated in `static` mode.
            // Relative to bundles output directory.
            reportFilename: "../../../webpack-bundles.report.html",
            // Module sizes to show in report by default.
            // Should be one of `stat`, `parsed` or `gzip`.
            // See "Definitions" section for more information.
            defaultSizes: "gzip",
            // Automatically open report in default browser
            openAnalyzer: false,
            // If `true`, Webpack Stats JSON file will be generated in bundles output directory
            generateStatsFile: true,
            // Name of Webpack Stats JSON file that will be generated if `generateStatsFile` is `true`.
            // Relative to bundles output directory.
            statsFilename: "../../../webpack-stats.json",
            // Options for `stats.toJson()` method.
            // For example you can exclude sources of your modules from stats file with `source: false` option.
            // See more options here: https://github.com/webpack/webpack/blob/webpack-1/lib/Stats.js#L21
            //statsOptions: null,
            // Log level. Can be "info", "warn", "error" or "silent".
            //logLevel: "info"
        }),

        // https://www.npmjs.com/package/webpack-manifest-plugin
        new ManifestPlugin({
            writeToFileEmit: true,
            map: asset => {
                asset.path = "/public/assets/" + asset.path;
                return asset;
            }
        })

    ]
});

module.exports = webpackConfig;
