/***********************************************************************************************************************
 *
 * SCHEDULINGG PROCESS
 *
 * @type {Node.js}
 *
 * This file is started as a seperate node process
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const logger = require("./handlers/logger/console");
const cron = require("./cron/index");

// import environmental variables from our .env file to process.env
require("dotenv").config({path: "./server/config/.env"});

// require all mongoose schemas
require("./models/");

/*
 * connect and prepare MongoDB
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
        logger.success("[cron] Successfully connected to MongoDB.");
    });

cron.startup();
