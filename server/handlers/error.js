/***********************************************************************************************************************
 *
 * ERROR HANDLING
 *
 * methods that handle any application errors that might occur.
 *
 * @exports {function} catchErrors - wrapper for async/await functions
 * @exports {ExpressMiddleWare} notFound
 * @exports {ExpressMiddleWare} flashValidationErrors
 * @exports {ExpressMiddleWare} developmentErrors
 * @exports {ExpressMiddleWare} productionErrors
 *
 **********************************************************************************************************************/
const logger = require("./logger/console");

/*
 * Catch Errors Handler
 *
 * With async/await, you need some way to catch errors
 * Instead of using try{} catch(e) {} in each controller, we wrap the function in
 * catchErrors(), catch and errors they throw, and pass it along
 * to our express middleware with next()
 *
 */
exports.catchErrors = fn => {
    return function(req, res, next) {
        return fn(req, res, next).catch(next);
    };
};

/*
 * Not Found Error Handler
 *
 * If we hit a route that is not found, we mark it as 404
 * and pass it along to the next error handler to display
 *
 * @param {Request} req http://expressjs.com/en/4x/api.html#req
 * @param {Response} res http://expressjs.com/en/4x/api.html#res
 * @param {MiddleWare} next http://expressjs.com/en/guide/using-middleware.html
 *
 */
exports.notFound = (req, res, next) => {
    const err = new Error("Not Found");
    err.status = 404;
    logger.error(`[Express] 404 Not Found: "${req.path}"`);
    next(err);
};

/*
 * MongoDB Validation Error Handler
 *
 * Detect if there are mongodb validation errors that we can nicely show via flash messages
 *
 * @param {object} err - Error object
 * @param {Request} req http://expressjs.com/en/4x/api.html#req
 * @param {Response} res http://expressjs.com/en/4x/api.html#res
 * @param {MiddleWare} next http://expressjs.com/en/guide/using-middleware.html
 *
 */
exports.flashValidationErrors = (err, req, res, next) => {
    if (!err.errors) return next(err);
    // validation errors look like
    const errorKeys = Object.keys(err.errors);
    errorKeys.forEach(key => req.flash("error", err.errors[key].message));
    res.redirect("back");
};

/*
 * Development Error Handler
 *
 * In development we show good error messages so if we hit a syntax error
 * or any other previously un-handled error, we can show good info on what happened
 *
 * @param {object} err - Error object
 * @param {Request} req http://expressjs.com/en/4x/api.html#req
 * @param {Response} res http://expressjs.com/en/4x/api.html#res
 * @param {MiddleWare} next http://expressjs.com/en/guide/using-middleware.html
 *
 */
exports.developmentErrors = (err, req, res, next) => {
    err.stack = err.stack || "";
    const errorDetails = {
        message: err.message,
        status: err.status || 500,
        stackHighlighted: err.stack.replace(
            /[a-z_-\d]+.js:\d+:\d+/gi,
            "<mark>$&</mark>"
        ),
        title: err.message
    };
    res.status(errorDetails.status);
    if (err.status !== 404) {
        // we have already handled 404s above.
        logger.error(
            `[Node] ${errorDetails.status} ${errorDetails.message}\r\n"${req.path}"\r\n${err.stack}`
        );
    }
    res.format({
        // Based on the `Accept` http header
        "text/html": () => {
            // Render template
            res.render("error", errorDetails);
        },
        "application/json": () => {
            // Ajax call, send JSON back
            res.json(errorDetails);
        }
    });
};

/*
 * Production Error Handler
 *
 * No stacktraces are leaked to user
 *
 * @param {object} err - Error object
 * @param {Request} req http://expressjs.com/en/4x/api.html#req
 * @param {Response} res http://expressjs.com/en/4x/api.html#res
 * @param {MiddleWare} next http://expressjs.com/en/guide/using-middleware.html
 *
 */
exports.productionErrors = (err, req, res, next) => {
    res.status(err.status || 500);
    res.render("error", {
        message: err.message,
        title: err.message,
        error: {}
    });
    if (err.status !== 404) {
        // we have already handled 404s above.
        logger.error(
            `[Node] ${err.status} ${err.message}\r\n"${req.path}"\r\n${err.stack}`
        );
    }
};
