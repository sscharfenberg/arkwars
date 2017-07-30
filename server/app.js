/***********************************************************************************************************************
 *
 * MAIN APPLICATION
 *
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
const expressValidator = require("express-validator"); // https://www.npmjs.com/package/express-validator
const helmet = require("helmet"); // https://helmetjs.github.io/docs/
const mongoose = require("mongoose"); // https://www.npmjs.com/package/mongoose
const redis = require("redis"); // https://www.npmjs.com/package/redis
const RedisStore = require("connect-redis")(session); // https://www.npmjs.com/package/connect-mongo
const cookieParser = require("cookie-parser"); // https://www.npmjs.com/package/cookie-parser
const bodyParser = require("body-parser"); // https://www.npmjs.com/package/body-parser
const passport = require("passport"); // https://github.com/jaredhanson/passport
const flash = require("connect-flash"); // https://www.npmjs.com/package/connect-flash
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const routes = require("./routes/index"); // Express routes
const accessLogger = require("./handlers/logger/access"); // Access logging
const errorHandlers = require("./handlers/error"); // Error handling
const logger = require("./handlers/logger/console");
const templateHelpers = require("./handlers/template"); // Template helpers

// create our Express app
const app = express();

// set specific headers.
app.use(helmet());

// view engine setup
// https://pugjs.org/
app.set("views", path.join(__dirname, "views")); // set views to correct folder
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
app.use(expressValidator());

// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

// Sessions Handling. use redis for session handling because faster.
const redisClient = redis
    .createClient({
        url: process.env.REDIS
    })
    .on("ready", () => {
        logger.success("[App] Successfully connected to Redis.");
    })
    .on("error", err => {
        logger.error("[App] Error while connecting to Redis.");
        logger.error(err);
    });
app.use(
    session({
        secret: process.env.SECRET,
        key: process.env.KEY,
        resave: false,
        saveUninitialized: true,
        store: new RedisStore({
            client: redisClient
        })
    })
);

// // Passport JS is what we use to handle our logins
const User = require("./models/User");
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

// The flash middleware let's us use req.flash('error', 'Shit!')
// which will then pass that message to the next page the user requests
app.use(flash());

// setup i18n
i18n.configure({
    locales: ["en", "de"],
    objectNotation: true,
    updateFiles: false,
    directory: path.join(__dirname, "lang")
});

// pass variables to our templates + all requests
app.use((req, res, next) => {
    let locale = "en";
    if (req.session && req.session.locale) {
        locale = req.session.locale;
    }
    if (req.user && req.user.locale) {
        locale = req.user.locale;
    }
    req.session.locale = locale;
    i18n.setLocale(locale);
    res.locals.h = templateHelpers;
    res.locals.flashes = req.flash();
    //    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    res.locals.session = req.session;
    res.locals.user = req.user;
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
