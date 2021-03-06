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
//const HtmlWebpackPlugin = require("html-webpack-plugin");
// https://github.com/webpack-contrib/extract-text-webpack-plugin
const ExtractTextPlugin = require("extract-text-webpack-plugin");
// https://github.com/JaKXz/stylelint-webpack-plugin
const StylelintPlugin = require("stylelint-webpack-plugin");
const cfg = require("../config");
const isProd = process.env.NODE_ENV === "production";

/*
 * base style loaders: sass, then css
 * @returns {Array}
 */
const baseLoaders = [
    // translates CSS into CommonJS
    {loader: "css-loader", options: {sourceMap: true, minimize: true}},
    // compiles SCSS to CSS
    {
        loader: "sass-loader",
        options: {
            sourceMap: true,
            // "~" means "resolve as a module"
            data: `@import "~Theme/abstracts/config";
@import "~Theme/abstracts/functions";
@import "~Theme/abstracts/mixins";`
        }
    }
];

/*
 * construct all our scss loaders
 * @returns {Array} of loaders
 * @returns {ExtractTextPlugin} with baseloaders
 */
const vueScssLoaders = () => {
    if (isProd) {
        // for prod, we need to extract an actual css file
        return ExtractTextPlugin.extract({use: baseLoaders});
    } else {
        // prepare array with only vue-style-loader
        const styleLoaders = [
            {
                loader: "vue-style-loader", // inject styles into DOM
                options: {sourceMap: true}
            }
        ];
        // return them so vue-style-loader is first item of array
        // which means it is executed last
        return styleLoaders.concat(baseLoaders);
    }
};

const webpackConfig = {
    // Don"t attempt to continue if there are any errors.
    bail: true,

    // https://webpack.js.org/configuration/entry-context/
    context: path.join(cfg.projectRoot, "client"),

    // get configured chunks from config file
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
                exclude: /node_modules/,
                include: path.join(cfg.projectRoot, "client"),
                use: [
                    {
                        // http://eslint.org/docs/user-guide/configuring
                        loader: require.resolve("eslint-loader"),
                        options: {
                            formatter: require("eslint-friendly-formatter"),
                            configFile: cfg.paths.eslintrc
                        }
                    }
                ]
            },

            {
                // https://github.com/babel/babel-loader
                test: /\.(js|vue)$/,
                exclude: /node_modules/,
                loader: require.resolve("babel-loader"),
                options: {
                    extends: path.join(cfg.projectRoot, ".babelrc"),
                    cacheDirectory: path.join(cfg.projectRoot, ".babel-cache")
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
                    // we use the same postcss plugins for prod and dev
                    // to make sure there are no differences and funny surprises in prod
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
                            limit: 4096,
                            name: "[name].[hash].[ext]",
                            fallback: "file-loader"
                        }
                    }
                ]
            }
        ]
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    minChunks: 2,
                    chunks: "all",
                    priority: -10
                },
                common: {
                    test: new RegExp("time.js|common|shared"),
                    chunks: "initial",
                    name: "common",
                    minChunks: 2,
                    enforce: true
                }
            }
        }
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
            vue$: "vue/dist/vue.esm.js",
            Theme: path.join(cfg.projectRoot, "client", "theme"),
            Game: path.join(cfg.projectRoot, "client", "game"),
            Config: path.join(cfg.projectRoot, "client", "config"),
            Shared: path.join(cfg.projectRoot, "shared")
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

        // https://github.com/JaKXz/stylelint-webpack-plugin
        new StylelintPlugin({
            files: ["**/*.vue"],
            syntax: "scss",
            reporters: [{ formatter: "verbose", console: true }],
            configFile: path.join(cfg.projectRoot, ".stylelintrc")
        })

    ],

    // shamelessly copied from
    // https://github.com/vuejs-templates/webpack/blob/develop/template/build/webpack.base.conf.js
    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: "empty",
        fs: "empty",
        net: "empty",
        tls: "empty",
        child_process: "empty"
    }
};

module.exports = webpackConfig;
