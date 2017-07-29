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
const logger = require("./app/handlers/logger/console");
const cron = require("./app/handlers/cron");
const errorHandlers = require("./app/handlers/error"); // Error handling

// import environmental variables from our .env file to process.env
require("dotenv").config({ path: "./server/app/config/.env" });

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
        logger.error(err.message);
    })
    .on("connected", () => {
        logger.success("[App] Successfully connected to MongoDB.");
    });


// require mongoose schemas
require("./app/models/User");
require("./app/models/Game");

errorHandlers.catchErrors(cron.startup());

/*
 * start the application
 *
 */
const app = require("./app"); // app.js exports the express app
app.set("port", process.env.PORT || 80); // set port

// start server by listening to requests on app port
const server = app.listen(app.get("port"), () => {
    logger.info(
        `[node] Server now listening on port ${chalk.yellow(app.get("port"))}`
    );
});
