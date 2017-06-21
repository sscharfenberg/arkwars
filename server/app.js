/***********************************************************************************************************************
 *
 * MAIN APPLICATION
 *
 * @type {Node.js}
 * @exports {Express} app
 *
 * Bootstrap our application
 *
 **********************************************************************************************************************/
const fs = require("fs"); // https://nodejs.org/api/fs.html
const path = require("path"); // https://nodejs.org/api/path.html
const express = require("express"); // http://expressjs.com/
const compression = require("compression"); // https://github.com/expressjs/compression
const session = require("express-session"); // https://www.npmjs.com/package/express-session
const mongoose = require("mongoose"); // https://www.npmjs.com/package/mongoose
const MongoStore = require("connect-mongo")(session); // https://www.npmjs.com/package/connect-mongo
const cookieParser = require("cookie-parser"); // https://www.npmjs.com/package/cookie-parser
const bodyParser = require("body-parser"); // https://www.npmjs.com/package/body-parser
const passport = require("passport"); // https://github.com/jaredhanson/passport
const flash = require("connect-flash"); // https://www.npmjs.com/package/connect-flash
const routes = require("./app/routes/index"); // Express routes
const accessLogger = require("./app/handlers/logger/access"); // Access logging
const errorHandlers = require("./app/handlers/error"); // Error handling
const templateHelpers = require("./app/utils/template"); // Template helpers

// create our Express app
const app = express();

// disable x-powered-by header
app.disable("x-powered-by");

// view engine setup
// https://pugjs.org/
app.set("views", path.join(__dirname, "app", "views")); // set views to correct folder
app.set("view engine", "pug"); // set view engine to pug

// https://github.com/expressjs/compression
app.use(compression());

// serves up static files from the public folder. Anything in public/ will just be served up as the file it is
app.use("/public", express.static(path.join(__dirname, "public")));

// Takes the raw requests and turns them into usable properties on req.body
app.use(bodyParser.json());
// https://www.npmjs.com/package/body-parser#bodyparserurlencodedoptions
app.use(bodyParser.urlencoded({ extended: true }));

// validate data middleWare
//app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(
    session({
        secret: process.env.SECRET,
        key: process.env.KEY,
        resave: false,
        saveUninitialized: true,
        store: new MongoStore({ mongooseConnection: mongoose.connection })
    })
);

// // Passport JS is what we use to handle our logins
app.use(passport.initialize());
app.use(passport.session());

// The flash middleware let's us use req.flash('error', 'Shit!')
// which will then pass that message to the next page the user requests
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
    res.locals.h = templateHelpers;
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
});

// log client access to the app in Apache Combined Emoji format
app.use(accessLogger);

// after passing all of the above middleware, handle our routes
app.use("/", routes);

// If the above routes didnt work, 404 and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get("env") === "development") {
    // Development Error Handler - Prints stack trace
    app.use(errorHandlers.developmentErrors);
} else {
    // production error handler
    app.use(errorHandlers.productionErrors);
}

// we export the express app so we can start the site in start.js
module.exports = app;
