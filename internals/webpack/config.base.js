/***********************************************************************************************************************
 *
 * WEBPACK BASE CONFIG
 *
 * @exports {object} webpackConfig
 *
 * fuck yeah webpack.
 *
 **********************************************************************************************************************/
const path = require("path"); // https://www.npmjs.com/package/path
const webpack = require("webpack"); // https://www.npmjs.com/package/webpack
// https://www.npmjs.com/package/html-webpack-plugin
const HtmlWebpackPlugin = require("html-webpack-plugin");
// https://github.com/webpack-contrib/extract-text-webpack-plugin
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const cfg = require("../config");
const isProd = process.env.NODE_ENV === "production";
const vueScssLoaders = () => {
    if (isProd) {
        // for prod, we need to extract an actual css file
        return ExtractTextPlugin.extract({
            use: ["css-loader", "sass-loader"],
            fallback: "vue-style-loader"
        });
    } else {
        return "vue-style-loader!css-loader!sass-loader";
    }
};

const webpackConfig = {
    // Don"t attempt to continue if there are any errors.
    bail: true,

    // https://webpack.js.org/configuration/entry-context/
    context: path.join(cfg.projectRoot, "client"),

    // get configured chunks from config file so we can loop them
    entry: cfg.chunks,

    // https://webpack.js.org/configuration/output/
    output: {
        path: path.join(cfg.projectRoot, "server", "public", "assets"),
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
            // It"s important to do this before Babel processes the JS.
            {
                test: /\.(js|vue)$/,
                enforce: "pre",
                exclude: /node_modules|vendor|bower_components/,
                include: path.join(cfg.projectRoot, "client"),
                use: [
                    {
                        // http://eslint.org/docs/user-guide/configuring
                        loader: require.resolve("eslint-loader"),
                        options: {
                            formatter: require("eslint-friendly-formatter"),
                            configFile: path.join(
                                cfg.projectRoot,
                                "internals",
                                "config",
                                ".eslintrc.js"
                            )
                        }
                    }
                ]
            },

            {
                // https://github.com/babel/babel-loader
                test: /\.(js|vue)$/,
                exclude: /node_modules|vendor|bower_components/,
                loader: require.resolve("babel-loader"),
                options: {
                    presets: [
                        [
                            // https://github.com/babel/babel-preset-env
                            "env",
                            {
                                targets: {browsers: cfg.browsers},
                                useBuiltIns: true // https://github.com/babel/babel-preset-env#usebuiltins
                            }
                        ]
                    ]
                }
            },

            {
                // https://github.com/vuejs/vue-loader
                // https://vue-loader.vuejs.org/en/
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    loaders: {
                        scss: vueScssLoaders()
                    },
                    transformToRequire: {
                        video: "src",
                        source: "src",
                        img: "src",
                        image: "xlink:href"
                    },
                    postcss: [
                        require("postcss-flexbugs-fixes")(),
                        require("autoprefixer")(),
                        require("cssnano")()
                    ]
                }
            },

            {
                // loader for images
                // https://github.com/webpack-contrib/url-loader
                test: /\.(png|jpe?g|gif|svg)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 8192,
                            name: "[name].[hash].[ext]",
                            fallback: "file-loader"
                        }
                    }
                ]
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
        alias: {
            vue$: "vue/dist/vue.esm.js"
        },
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
        // Moment.js is an extremely popular library that bundles large locale files
        // by default due to how Webpack interprets its code. This is a practical
        // solution that requires the user to opt into importing specific locales.
        // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        // https://webpack.js.org/plugins/commons-chunk-plugin
        // The CommonsChunkPlugin is an opt-in feature that creates a separate file
        // (known as a chunk), consisting of common modules shared between multiple entry points.
        new webpack.optimize.CommonsChunkPlugin({
            name: "common",
            filename: "common.js",
            minChunks: 2
        })
    ]
};

// HTML Webpack Plugins for FOOTER
// https://github.com/jantimon/html-webpack-plugin
for (let chunk in cfg.chunks) {
    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            // write the pug SCRIPT includes (footer)
            template: path.join(
                cfg.projectRoot,
                "internals",
                "webpack",
                "templates",
                `${chunk}.footer.ejs`
            ),
            filename: path.join(
                cfg.projectRoot,
                "server",
                "views",
                "webpack",
                `${chunk}.footer.pug`
            ),
            showErrors: true,
            inject: false,
            alwaysWriteToDisk: true,
            meta: {
                isProd: isProd, // make sure we have information in the template if prod or dev
                webPackPort: cfg.webPackPort
            }
        })
    );
}

// HTML Webpack Plugin for HEADER
// prod extracts styles to css file and we need the header include with content hash
// https://github.com/jantimon/html-webpack-plugin
const invalidChunks = ["admin", "app"]; // non-Vue gulp chunks that do not need to extract css
const validChunks = Object.keys(cfg.chunks).filter(
    chunk => !invalidChunks.includes(chunk)
);
validChunks.forEach(chunk => {
    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: path.join(
                cfg.projectRoot,
                "internals",
                "webpack",
                "templates",
                `${chunk}.header.ejs`
            ),
            filename: path.join(
                cfg.projectRoot,
                "server",
                "views",
                "webpack",
                `${chunk}.header.pug`
            ),
            showErrors: true,
            inject: false,
            alwaysWriteToDisk: true,
            meta: {
                isProd: isProd, // make sure we have information in the template if prod or dev
                webPackPort: cfg.webPackPort
            }
        })
    );
});

module.exports = webpackConfig;
