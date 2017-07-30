/***********************************************************************************************************************
 *
 * resetController
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
const User = mongoose.model("User");


/*
 * resend activation link ==============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showResetForm = (req, res) => {
    const captcha = getCaptcha();
    req.session.captcha = captcha.text;
    res.render("auth/reset", {
        title: i18n.__("APP.RESET.TITLE"),
        session: req.session,
        captcha: captcha.data
    });
};


/*
 * validate a POST reset password request. =============================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateRequest = async (req, res, next) => {
    logger.info(`[App] reset password request for ${chalk.cyan(req.body.email)}`);
    const errors = {};
    let captchaFail = false;


    // if there is a captcha error, abort and show only captcha error
    // make sure we don't give too much information for robots
    if (req.body.captcha === "") {
        captchaFail = i18n.__("APP.REGISTER.ERROR.CaptchaEmpty");
    } else if (req.body.captcha !== req.session.captcha) {
        captchaFail = i18n.__("APP.REGISTER.ERROR.CaptchaMismatch");
    }
    if (captchaFail) {
        const captcha = getCaptcha(req.session.captcha);
        errors.captcha = { msg: captchaFail };
        return res.render("auth/reset", {
            title: i18n.__("APP.RESET.TITLE"),
            session: req.session,
            data: req.body,
            errors,
            captcha,
            flashes: req.flash()
        });
    }

    // check if we found a user with that email address
    const emailUser = await User.findOne({ email: req.body.email });
    if (!emailUser) {
        errors.email = { msg: i18n.__("APP.RESET.ERR_EmailNotFound") };
        logger.error(
            `[App] got reset request, could not find the email "${req.body.email}".`
        );
    }
    if (!emailUser.emailConfirmed) {
        errors.email = { msg: i18n.__("APP.RESET.ERR_EmailNotYetConfirmed") };
        logger.error(
            `[App] got reset request, email not yet confirmed "${req.body.email}".`
        );
    }

    // user is suspended and suspendedUntil is > now
    if (
        emailUser.suspended &&
        moment(emailUser.suspendedUntil).diff(moment()) > 0
    ) {
        errors.email = { msg: i18n.__("APP.RESET.ERR_UserSuspended") + moment(emailUser.suspendedUntil).format("LLL") };
        logger.error(
            `[App] got reset request, user with email "${chalk.cyan(req.body.email)}" is suspended .`
        );
    }

    if (errors.email || errors.captcha) {
        const captcha = getCaptcha();
        req.session.captcha = captcha.text;
        return res.render("auth/reset", {
            title: i18n.__("APP.RESET.TITLE"),
            session: req.session,
            data: req.body,
            errors,
            captcha: captcha.data,
            flashes: req.flash()
        });
    }

    // no errors, proceed.
    next();
};


/*
 * do password reset: update user, send email. =========================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.doReset = (req, res) => {
    console.log("do reset");
    req.flash("warning", "do reset");
    res.redirect("/");
};
