/***********************************************************************************************************************
 *
 * NODEMON
 *
 * @type {Node.js}
 *
 * This script starts our app, monitors the node task and restarts the task if files have changed
 * it is called directly via NPM
 *
 **********************************************************************************************************************/
const logger        = require( "./app/handlers/logger/console" );
const path          = require( "path" );                            // https://nodejs.org/api/path.html
const nodemon       = require( "nodemon" );                         // https://github.com/remy/nodemon
const monitor = nodemon( {
    script: path.join( __dirname, "start.js" )
    , ext: "js json jsx"
    , ignore: [
        "server/public/"
        , "client/**/*"
        , "internals/**/*"
        , "node_modules"
        , "packag*.json"
    ]
    , verbose: true
} );

monitor.on( "start", () => {
    logger.debug( "[nodemon] app has started." );
} );

monitor.on( "quit", () => {
    logger.debug( "[nodemon] app has quit." );
} );

monitor.on( "restart", ( files ) => {
    //console.log( files.toString() );
    logger.debug( "[nodemon] App restarted due to\r\n" + files.toString() );
} );

monitor.on( "crash", () => {
    logger.error( "[nodemon] app has crashed." );
} );
