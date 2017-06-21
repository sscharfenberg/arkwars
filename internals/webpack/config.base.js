/***********************************************************************************************************************
 *
 * WEBPACK BASE CONFIG
 *
 * @type {Node.js}
 * @exports {object} webpackConfig
 *
 * fuck yeah webpack.
 *
 **********************************************************************************************************************/
const path = require("path"); // https://www.npmjs.com/package/path
const webpack = require("webpack"); // https://www.npmjs.com/package/webpack
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // https://github.com/webpack-contrib/extract-text-webpack-plugin
const HtmlWebpackPlugin = require("html-webpack-plugin"); // https://www.npmjs.com/package/html-webpack-plugin
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin"); // https://www.npmjs.com/package/html-webpack-harddisk-plugin
const autoprefixer = require("autoprefixer"); // https://github.com/postcss/autoprefixer
const postCssFlexboxFixes = require("postcss-flexbugs-fixes"); // https://github.com/luisrudge/postcss-flexbugs-fixes
const sassLintPlugin = require("sasslint-webpack-plugin"); // https://github.com/alleyinteractive/sasslint-webpack-plugin
const config = require("../config");
const extractCss = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

const webpackConfig = {
    // Don't attempt to continue if there are any errors.
    bail: true,

    // https://webpack.js.org/configuration/entry-context/
    context: path.join(config.projectRoot, "client"),

    // get configured chunks from config file so we can loop them
    entry: config.chunks,

    // https://webpack.js.org/configuration/output/
    output: {
        path: path.join(config.projectRoot, "server", "public", "assets"),
        filename: "[name].[chunkhash].js"
    },

    // https://webpack.js.org/configuration/module/
    module: {
        // An array of Rules which are matched to requests when modules are created.
        // These rules can modify how the module is created.
        // They can apply loaders to the module, or modify the parser.
        rules: [
            // http://eslint.org
            // https://www.npmjs.com/package/eslint-loader
            // It's important to do this before Babel processes the JS.
            {
                test: /\.(js|jsx)$/,
                enforce: "pre",
                exclude: /node_modules|vendor|bower_components/,
                include: path.join(config.projectRoot, "client"),
                use: [
                    {
                        // http://eslint.org/docs/user-guide/configuring
                        loader: require.resolve("eslint-loader"),
                        options: {
                            formatter: require("eslint-friendly-formatter"),
                            configFile: path.join(
                                config.projectRoot,
                                "config",
                                ".eslintrc.js"
                            )
                        }
                    }
                ]
            },

            {
                // https://github.com/babel/babel-loader
                test: /\.(js|jsx)$/,
                exclude: /node_modules|vendor|bower_components/,
                loader: require.resolve("babel-loader"),
                options: {
                    presets: [
                        [
                            // https://github.com/babel/babel-preset-env
                            "env",
                            {
                                targets: { browsers: config.browsers },
                                useBuiltIns: true // https://github.com/babel/babel-preset-env#usebuiltins
                            }
                        ],
                        "react"
                    ]
                }
            },

            {
                // extract scss into a seperate file
                test: /\.scss$/,
                loader: extractCss.extract({
                    fallback: ["style-loader"], // use style-loader in development
                    use: [
                        {
                            // https://github.com/webpack-contrib/css-loader
                            loader: "css-loader",
                            options: {
                                // https://github.com/webpack-contrib/css-loader#options
                                sourceMap: true,
                                minimize: true,
                                root: path.join(config.projectRoot, "client"),
                                url: true // Enable/Disable url() handling
                            }
                        },
                        {
                            // https://github.com/postcss/postcss-loader
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true,
                                plugins: [
                                    autoprefixer({
                                        browsers: config.browsers
                                    }),
                                    postCssFlexboxFixes
                                ]
                            }
                        },
                        {
                            // https://github.com/webpack-contrib/sass-loader
                            loader: "sass-loader",
                            options: {
                                sourceMap: true,
                                includePaths: [
                                    path.join(config.projectRoot, "client")
                                ]
                            }
                        }
                    ]
                })
            },

            {
                // https://github.com/webpack-contrib/file-loader
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: require.resolve("file-loader"),
                query: {
                    name: "[name].[hash].[ext]",
                    publicPath: "/public/assets/",
                    outputPath: "fonts/"
                }
            }
        ]
    },

    // https://webpack.js.org/configuration/resolve/
    // A resolver is a library which helps in locating a module by its absolute path.
    // A module can be required as a dependency from another module
    resolve: {
        // Tell webpack what directories should be searched when resolving modules.
        // https://webpack.js.org/configuration/resolve/#resolve-modules
        // "node_modules" is default
        modules: ["node_modules"],
        // define aliases for imports here, saves typing.
        // https://webpack.js.org/configuration/resolve/#resolve-alias
        alias: {},
        // symbolic links. disable if needed
        // https://webpack.js.org/configuration/resolve/#resolve-symlinks
        symlinks: true
    },

    // https://webpack.js.org/configuration/target/
    // async-node | electron | electron-renderer | node | node-webkit | web (default) | webworker
    target: "web",

    // https://webpack.js.org/configuration/plugins/
    // https://webpack.js.org/plugins/
    plugins: [
        extractCss,

        // https://www.npmjs.com/package/html-webpack-harddisk-plugin
        // webpack-dev-server does not write to disk. use harddisk plugin to force write to disk
        // so we can update paths to webpack-dev-server js files in pug script include
        new HtmlWebpackHarddiskPlugin(),

        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how Webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        // You can remove this if you don't use Moment.js:
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        new sassLintPlugin({
            configFile: path.join(
                config.projectRoot,
                "config",
                ".sass-lint.yml"
            ),
            // Array of files to ignore, must be full path, Default: none
            ignoreFiles: [],
            // Array of plugins to ignore, Default: none (example: extract-text-webpack-plugin)
            ignorePlugins: [
                "extract-text-webpack-plugin",
                "html-webpack-plugin"
            ],
            // Change the glob pattern for finding files. Default: (**/*.s?(a|c)ss)
            glob: "**/*.scss",
            //  Suppress warnings, errors will still show. Default: false
            quiet: false,
            // Have Webpack's build process die on warning. Default: false
            failOnWarning: false,
            // Have Webpack's build process die on error. Default: false
            failOnError: true,
            // Quites output normally for testing purposes, Default: 'false' Caution do not use this unless you are catching errors via Webpack CLI!
            testing: false
        })
    ]
};

// https://github.com/jantimon/html-webpack-plugin
// https://github.com/jaketrent/html-webpack-template
for (let chunk in config.chunks) {
    let isProd = process.env.NODE_ENV === "production";
    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            // write the pug STYLE includes (head)
            template: path.join(
                config.projectRoot,
                "internals",
                "webpack",
                "templates",
                `${chunk}.head.ejs`
            ),
            filename: path.join(
                config.projectRoot,
                "server",
                "app",
                "views",
                "webpack.includes",
                `${chunk}.head.pug`
            ),
            showErrors: true,
            inject: false,
            alwaysWriteToDisk: true,
            meta: {
                isProd: isProd, // make sure we have information in the template if prod or dev
                webPackPort: config.webPackPort
            }
        }),
        new HtmlWebpackPlugin({
            // write the pug SCRIPT includes (footer)
            template: path.join(
                config.projectRoot,
                "internals",
                "webpack",
                "templates",
                `${chunk}.footer.ejs`
            ),
            filename: path.join(
                config.projectRoot,
                "server",
                "app",
                "views",
                "webpack.includes",
                `${chunk}.footer.pug`
            ),
            showErrors: true,
            inject: false,
            alwaysWriteToDisk: true,
            meta: {
                isProd: isProd, // make sure we have information in the template if prod or dev
                webPackPort: config.webPackPort
            }
        })
    );
}

module.exports = webpackConfig;
