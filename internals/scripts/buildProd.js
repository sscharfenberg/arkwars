/***********************************************************************************************************************
 *
 * BUILD CLIENT PRODUCTION ASSETS
 *
 * @type {Node.js}
 *
 **********************************************************************************************************************/
"use strict";

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = "production";
process.env.NODE_ENV = "production";

const fs            = require( "fs-extra" );
const webpack       = require( "webpack" ); // https://www.npmjs.com/package/webpack
const webpackConfig = require( "../webpack/config.prod" ); // webpack PRODUCTION config
const logger        = require( "./utils/clientlogger" );
const config        = require( "../config" );

logger.info( `[node] preparing client assets for ${process.env.NODE_ENV.toUpperCase()}` );

// clean up paths.
fs.emptyDirSync( config.buildDir );
logger.info( `[node] emptied assets directory:\n${config.buildDir}` );
fs.emptyDirSync( config.pugScriptInclude );
logger.info( `[node] emptied pug script include template directory:\n${config.pugScriptInclude}\n` );

webpack( webpackConfig, ( err, stats ) => {
    if ( err ) {
        throw err;
    } else {
        process.stdout.write( stats.toString( config.webPackStats ) + "\n\n" );
        logger.info( `[webpack] done.` );
        logger.debug( `[node] site is now in PRODUCTION mode mode.` );
        process.exit( 0 ); // signal everything went ok if we got this far.
    }
} );
