/***********************************************************************************************************************
 *
 * authController
 *
 **********************************************************************************************************************/
const passport = require("passport"); // https://github.com/jaredhanson/passport
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const moment = require("moment"); // https://momentjs.com/

/*
 * show login form =====================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showLoginForm = (req, res) => {
    res.render("auth/login", {
        title: i18n.__("PAGE_LOGIN_TITLE"),
        session: req.session
    });
};

/*
 * log the user in =====================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.login = (req, res, next) => {
    moment.locale(req.session.locale);
    passport.authenticate("local", function(err, user, info) {
        if (err) {
            return next(err);
        }

        // could not authenticate. passport-local-mongoose gives use error codes back
        if (!user) {
            req.flash("error", i18n.__(`PAGE_LOGIN_${info.name}`));
            return res.render("auth/login", {
                title: i18n.__("PAGE_LOGIN_TITLE"),
                session: req.session,
                errors: i18n.__(`PAGE_LOGIN_${info.name}`),
                data: req.body,
                flashes: req.flash()
            });
        }

        // if the email is not yet confirmed, show error message.
        if (!user.emailConfirmed) {
            const message = i18n.__("PAGE_LOGIN_NotConfirmedError");
            req.flash("error", message);
            return res.render("auth/login", {
                title: i18n.__("PAGE_LOGIN_TITLE"),
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
                i18n.__("PAGE_LOGIN_Suspended") +
                moment(user.suspendedUntil).format("LLL");
            req.flash("error", message);
            console.log(moment().locale());
            return res.render("auth/login", {
                title: i18n.__("PAGE_LOGIN_TITLE"),
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
            req.flash("success", i18n.__("PAGE_LOGIN_SUCCESS"));
            return res.redirect("/profile");
        });
    })(req, res, next);
};

/*
 * log the user out ====================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.logout = (req, res) => {
    req.logout();
    req.flash("success", i18n.__("PAGE_LOGOUT_SUCCESS"));
    return res.redirect("/");
};


/*
 * is current user an admin? ===========================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.isAdmin = (req, res, next) => {
    if (!req.user || !req.user.admin) {
        req.flash("error", i18n.__("AUTH_ADMIN_REQUIRED"));
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
        req.flash("error", i18n.__("AUTH_MOD_REQUIRED"));
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
    // first check if the user is authenticated
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", i18n.__("AUTH_LOGIN_REQUIRED"));
    res.redirect("/auth/login");
};
