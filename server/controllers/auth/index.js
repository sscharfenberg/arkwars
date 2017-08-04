/***********************************************************************************************************************
 *
 * authController
 *
 **********************************************************************************************************************/
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const moment = require("moment"); // https://momentjs.com/
const passport = require("passport"); // https://github.com/jaredhanson/passport
const logger = require("../../handlers/logger/console");


/*
 * show login form =====================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showLoginForm = (req, res) => {
    res.render("auth/login", {
        title: i18n.__("APP.LOGIN.TITLE"),
        session: req.session
    });
};


/*
 * log the user in =====================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.login = async (req, res, next) => {
    moment.locale(req.session.locale);
    passport.authenticate("local", function(err, user, info) {
        if (err) {
            return next(err);
        }

        // could not authenticate. passport-local-mongoose gives use error codes back
        if (!user) {
            req.flash("error", i18n.__(`APP.LOGIN.${info.name}`));
            return res.render("auth/login", {
                title: i18n.__("APP.LOGIN.TITLE"),
                session: req.session,
                errors: i18n.__(`APP.LOGIN.${info.name}`),
                data: req.body,
                flashes: req.flash()
            });
        }

        // if the email is not yet confirmed, show error message.
        if (!user.emailConfirmed) {
            const message = i18n.__("APP.LOGIN.NotConfirmedError");
            req.flash("error", message);
            return res.render("auth/login", {
                title: i18n.__("APP.LOGIN.TITLE"),
                session: req.session,
                errors: message,
                data: req.body,
                flashes: req.flash()
            });
        }

        // user is suspended and suspendedUntil is > now
        if (
            user.suspended &&
            moment(user.suspendedUntil).diff(moment()) > 0
        ) {
            const message =
                i18n.__("APP.LOGIN.Suspended") +
                moment(user.suspendedUntil).format("LLL");
            req.flash("error", message);
            console.log(moment().locale());
            return res.render("auth/login", {
                title: i18n.__("APP.LOGIN.TITLE"),
                session: req.session,
                errors: message,
                data: req.body,
                flashes: req.flash()
            });
        }

        // log in
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            req.user = user;
            logger.info(`[App] user @${user.username} logged in.`);
            req.flash("success", i18n.__("APP.LOGIN.SUCCESS"));
            res.redirect("/dashboard");
        });
    })(req, res, next);
};


/*
 * log the user out ====================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.logout = (req, res) => {
    logger.info(`[App] user @${req.user.username} logging out.`);
    req.logout();
    req.flash("success", i18n.__("APP.LOGOUT.SUCCESS"));
    res.redirect("/");
};


/*
 * is current user an admin? ===========================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.isAdmin = (req, res, next) => {
    if (!req.user || !req.user.admin) {
        req.flash("error", i18n.__("APP.AUTH.ADMIN_REQUIRED"));
        res.redirect("back");
    } else {
        next();
    }
};


/*
 * is current user a moderator? ========================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.isMod = (req, res, next) => {
    if (!req.user || !req.user.moderator) {
        req.flash("error", i18n.__("APP.AUTH.MOD_REQUIRED"));
        res.redirect("back");
    } else {
        next();
    }
};


/*
 * is user logged in? ==================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", i18n.__("APP.AUTH.LOGIN_REQUIRED"));
        res.redirect("/auth/login");
    }
};

