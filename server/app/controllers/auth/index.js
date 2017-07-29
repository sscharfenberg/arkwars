/***********************************************************************************************************************
 *
 * authController
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const crypto = require("crypto"); // https://nodejs.org/api/crypto.html
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const passport = require("passport"); // https://github.com/jaredhanson/passport
const { getCaptcha } = require("../../handlers/captcha");
const logger = require("../../handlers/logger/console");
const mail = require("../../handlers/mail");
const cfg = require("../../config");
const User = mongoose.model("User");


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
exports.login = async (req, res, next) => {
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
            logger.info(`[App] user @${user.username} logged in.`);
            req.flash("success", i18n.__("PAGE_LOGIN_SUCCESS"));
            res.redirect("/profile");
        });
    })(req, res, next);
};

//exports.login = (req, res) => {
//    req.session.user = { id: "234234234", email: "ashaltiriak@gmail.com"};
//    req.flash("success", "logged in");
//    console.log("logged in - user: " + req.session.user);
//    res.redirect("/profile");
//};


/*
 * log the user out ====================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.logout = (req, res) => {
    logger.info(`[App] user @${req.user.username} logging out.`);
    req.logout();
    req.flash("success", i18n.__("PAGE_LOGOUT_SUCCESS"));
    res.redirect("/");
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
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("error", i18n.__("AUTH_LOGIN_REQUIRED"));
        res.redirect("/auth/login");
    }
};


/*
 * show "resend activation email" form =================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showResendForm = (req, res) => {
    const captcha = getCaptcha();
    req.session.captcha = captcha.text;
    res.render("auth/resend", {
        title: i18n.__("PAGE_RESEND_TITLE"),
        session: req.session,
        captcha: captcha.data,
        flashes: req.flash()
    });
};


/*
 * validate resend request =============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateResend = async (req, res, next) => {
    logger.info(`[App] resend activation email request for ${chalk.cyan(req.body.email)}`);
    const emailUser = await User.findOne({ email: req.body.email });
    const errors = [];
    let captchaFail = false;
    if (!emailUser) {
        errors.push(i18n.__("PAGE_RESEND_ERR_EmailNotFound"));
    }
    if (emailUser && emailUser.emailConfirmed && emailUser.emailConfirmationToken === "") {
        errors.push(i18n.__("PAGE_RESEND_ERR_EmailAlreadyConfirmed"));
    }

    if (req.body.captcha === "") {
        captchaFail = i18n.__("PAGE_REG_ERROR_CaptchaEmpty");
    } else if (req.body.captcha !== req.session.captcha) {
        captchaFail = i18n.__("PAGE_REG_ERROR_CaptchaMismatch");
    }

    if (captchaFail) {
        const captcha = getCaptcha(req.session.captcha);
        return res.render("auth/resend", {
            title: i18n.__("PAGE_RESEND_TITLE"),
            session: req.session,
            data: req.body,
            captcha,
            captchaFail,
            flashes: req.flash()
        });
    }

    if (errors.length) {
        const captcha = getCaptcha();
        req.session.captcha = captcha.text;
        return res.render("auth/resend", {
            title: i18n.__("PAGE_RESEND_TITLE"),
            session: req.session,
            data: req.body,
            captcha: captcha.data,
            captchaFail,
            errors: errors,
            flashes: req.flash()
        });
    }

    next();
};


/*
 * resend activation link ==============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.doResend = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    user.emailConfirmationToken = crypto.randomBytes(20).toString("hex");
    user.emailConfirmationExpires = moment().add(1, "hours");
    user.emailConfirmed = false;
    const confirmURL = `http://${req.headers
        .host}/auth/confirm/${user.emailConfirmationToken}`;
    await user.save();
    await mail.send({
        user,
        filename: "resend_email",
        subject: i18n.__("MAIL_RESEND_SUBJECT", cfg.app.title),
        confirmURL
    });
    logger.info(
        `[App] re-sent activation email to ${chalk.yellow(user.email)} and updated user with new confirm token.`
    );
    req.flash("success", i18n.__("MAIL_RESEND_SUCCESS"));
    return res.redirect("/");
};
