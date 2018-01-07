/***********************************************************************************************************************
 *
 * START EXPRESS SERVER
 *
 * @type {Node.js}
 *
 * This file is called directly via nodemon and starts the server
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // https://www.npmjs.com/package/mongoose
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("./handlers/logger/console");

// import environmental variables from our .env file to process.env
require("dotenv").config({path: "./server/config/.env"});

// require all mongoose schemas
require("./models/");

/*
 * connect and prepare MongoDB
 *
 */
mongoose.connect(process.env.DATABASE, {
    useMongoClient: true // http://mongoosejs.com/docs/connections.html#use-mongo-client
}); // Connect to our MongoDB
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises
mongoose.connection
    .on("error", err => {
        logger.error("[App] Error connecting to MongoDB.");
        logger.error(err);
    })
    .on("connected", () => {
        logger.success("[App] Successfully connected to MongoDB.");
    })
    .on("close", str => {
        logger.error("[App] MongoDB Connection closed: " + str);
    });

/*
 * start the application
 *
 */
const app = require("./app"); // app.js exports the express app
app.set("port", process.env.PORT || 80); // set port

// start server by listening to requests on app port
const server = app.listen(app.get("port"), () => {
    logger.info(
        `[node] Server listening on port ${chalk.yellow(app.get("port"))}`
    );
});
