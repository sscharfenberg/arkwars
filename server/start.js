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
const fs = require("fs"); // https://nodejs.org/api/path.html
const https = require("https"); // https://nodejs.org/api/https.html
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("./handlers/logger/console");
const httpsOptions = {
    key: fs.readFileSync( "./server/config/https/localhost.key" ),
    cert: fs.readFileSync( "./server/config/https/localhost.cert" ),
    requestCert: false,
    rejectUnauthorized: false
};

// import environmental variables from our .env file to process.env
require("dotenv").config({path: "./server/config/.env"});

// require all mongoose schemas
require("./models/");

/*
 * connect and prepare MongoDB
 *
 */
mongoose.connect(process.env.DATABASE); // Connect to our MongoDB
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
app.set("port", process.env.PORT || 443); // set port

const server = https.createServer( httpsOptions, app );

// start server by listening to requests on app port
server.listen(app.get("port"), () => {
    logger.info(`[node] Server listening on port ${chalk.yellow(app.get("port"))}`);
});
