/***********************************************************************************************************************
 *
 * CLIENT LOGGER
 *
 * @type {Node.js}
 *
 * simple wrapper for console log with colors and emoji
 *
 **********************************************************************************************************************/
const chalk             = require( "chalk" );               // https://www.npmjs.com/package/chalk
const moment            = require( "moment" );              // https://momentjs.com/
moment.locale( "de" );

exports.info = ( message ) => {
    console.log( moment().format( "HH:mm:ss.SSSS" ) + chalk.blue(   ` 🔑 INFO  🔑 → ${message}` ) );
};

exports.debug = ( message ) => {
    console.log( moment().format( "HH:mm:ss.SSSS" ) + chalk.cyan(   ` 🔧 DEBUG 🔧 → ${message}` ) );
};

exports.warn = ( message ) => {
    console.log( moment().format( "HH:mm:ss.SSSS" ) + chalk.yellow( ` 🔥 WARN  🔥 → ${message}` ) );
};

exports.error = ( message ) => {
    console.log( moment().format( "HH:mm:ss.SSSS" ) + chalk.red(    ` 💀 ERROR 💀 → ${message}` ) );
};
