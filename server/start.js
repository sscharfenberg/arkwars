/***********************************************************************************************************************
 *
 * START EXPRESS SERVER
 *
 * @type {Node.js}
 *
 * This file is called directly via nodemon and starts the server
 *
 **********************************************************************************************************************/
const mongoose      = require( "mongoose" );                            // https://www.npmjs.com/package/mongoose
const logger        = require( "./app/handlers/logger/console" );


// import environmental variables from our .env file to process.env
require( "dotenv" ).config( { path: "./config/.env" } );


/*
 * connect and prepare MongoDB
 *
 */
mongoose.connect( process.env.DATABASE ); // Connect to our MongoDB
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection.on( "error", ( err ) => {
    logger.error( err.message );
} ).on( "connected", () => {
    logger.info( "Successfully connected to MongoDB." );
} );


/*
 * start the application
 *
 */
const app = require( "./app" ); // app.js exports the express app
app.set( "port", process.env.PORT || 80 ); // set port
// start server by listening to requests on app port
const server = app.listen( app.get( "port" ), () => {
    logger.info( `Server now listening on port ${app.get( "port" )}` );
} );
