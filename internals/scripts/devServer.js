/***********************************************************************************************************************
 *
 * START CLIENT DEV SERVER
 *
 * @type {Node.js}
 *
 **********************************************************************************************************************/
"use strict";

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "development";
process.env.NODE_ENV = "development";

const fs                = require( "fs-extra" );
const path              = require( "path" ); // https://www.npmjs.com/package/path
const webpack           = require( "webpack" ); // https://www.npmjs.com/package/webpack
const webpackDevServer  = require( "webpack-dev-server" ); // https://webpack.js.org/configuration/dev-server/
const webpackConfig     = require( "../webpack/config.dev" ); // webpack DEVELOPMENT config
const logger            = require( "./utils/clientlogger" );
const config            = require( "../config" );

let compiler = webpack( webpackConfig );

logger.info( `[node] preparing webpack dev server for ${process.env.NODE_ENV.toUpperCase()}` );

// https://webpack.js.org/configuration/dev-server/
// start the dev server
let devServer = new webpackDevServer( compiler, {
    "proxy": { // https://webpack.js.org/configuration/dev-server/#devserver-proxy
        "*": `http://localhost:${config.webPackPort}`
    }
    , "headers": { // https://webpack.js.org/configuration/dev-server/#devserver-headers-
        "X-Powery-By": "Webpack Dev Server"
    }
    , "hot": true // https://webpack.js.org/configuration/dev-server/#devserver-hot
    , "compress": true // https://webpack.js.org/configuration/dev-server/#devserver-compress
    , "quiet": false // https://webpack.js.org/configuration/dev-server/#devserver-quiet-
    , "overlay": false // https://webpack.js.org/configuration/dev-server/#devserver-overlay
    , "stats": config.webPackStats
} );



// serve files on webPackPort
devServer.listen( config.webPackPort, "localhost", function( err ) {
    if( err ) throw err;

//    let chunkUrl = `http://localhost:${config.webPackPort}/app.js`;
//    let webpackLibUrl = `http://localhost:${config.webPackPort}/webpack-dev-server.js`;
//    let template = `script(src="${webpackLibUrl}" defer)
//script(src="${chunkUrl}" defer)`;
//    let targetPath = path.join( config.projectRoot, "server", "app", "views", "webpack.includes", "scripts.pug" );
//
//    // change the blade template that has the script tags with localhost URLs ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//    fs.writeFile( targetPath, template, "utf8", err => {
//        if (err ) {
//            throw err;
//        } else {
//            logger.info( "[node] changed pug script include file to point to webpack dev server URLs." );
//        }
//    } );

    setTimeout( function() {
        console.log();
        logger.info( `[webpack] now serving files on port ${config.webPackPort} ...` );
        logger.debug( `[node] site is now in ${process.env.NODE_ENV.toUpperCase()} mode.` );
    }, 2000 );

} ); // ================================================================================================================
