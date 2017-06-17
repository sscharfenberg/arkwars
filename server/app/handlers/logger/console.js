/***********************************************************************************************************************
 *
 * CONSOLE LOGGER
 *
 * this exports a winstonLogger instance for use in our app
 *
 * @type {Node.js}
 * @exports {winston.Logger} logger
 *
 **********************************************************************************************************************/
const moment            = require( "moment" );              // https://momentjs.com/
const path              = require( "path" );                // https://nodejs.org/api/path.html
const winston           = require( "winston" );             // https://github.com/winstonjs/winston


/*
 * Format a log-message
 *
 * single line if there are no params.meta
 *
 * @param {object} params - contains all data that we need
 * @returns {string} msg - formatted string
 *
 */
const formatLogLine = ( params ) => {
    let msg = moment().format( "DD.MM.YYYY HH:mm:ss.SSSS" ) +
        " [" + params.level.toUpperCase() + "] → " +
        params.message;
    if ( params.meta && Object.keys( params.meta ).length ) {
        msg += "\n" + JSON.stringify( params.meta, null, 2 );
    }
    return msg;
};


/*
 * winston.transports.Console
 *
 */
const consoleTransport = new ( winston.transports.Console )( {
    colorize: true
    , handleExceptions: true
    , json: false
    , level: "silly"
    , formatter( params ) {
        let message = formatLogLine( params );
        switch( params.level ){
            case "error":
                return `💀 ${message} 💀`;
                break;
            case "warning":
                return `🔥 ${message} 🔥`;
                break;
            case "info":
                return `🔑 ${message} 🔑`;
                break;
            case "debug":
                return `🔧 ${message} 🔧`;
                break;
        }
    }
} );


/*
 * winston.transports.File
 * https://github.com/winstonjs/winston/blob/master/docs/transports.md#file-transport
 *
 */
const fileTransport = new ( winston.transports.File )( {
    filename: path.join( __dirname, "..", "..", "..", "logs", moment().format("YYYYMMDD") + ".console.log" )
    , json: false
    , zippedArchive: true
    , handleExceptions: true
    , level: "debug"
    , formatter( params ) {
        return formatLogLine( params );
    }
} );


/*
 * create winston.Logger
 *
 */
const logger = new winston.Logger( {
    transports: [
        consoleTransport
        , fileTransport
    ]
} );

// no exit on unhandled exceptions, keep going.
logger.exitOnError = false;


module.exports = logger;

