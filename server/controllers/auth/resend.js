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
const { getCaptcha } = require("../../handlers/captcha");
const logger = require("../../handlers/logger/console");
const mail = require("../../handlers/mail");
const cfg = require("../../config");
const User = mongoose.model("User");


/*
 * show "resend activation email" form =================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showResendForm = (req, res) => {
    const captcha = getCaptcha();
    req.session.captcha = captcha.text;
    res.render("auth/resend", {
        title: i18n.__("APP.RESEND.TITLE"),
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
    logger.info(
        `[App] resend activation email request for ${chalk.cyan(
            req.body.email
        )}`
    );
    const emailUser = await User.findOne({ email: req.body.email });
    const errors = [];
    let captchaFail = false;
    if (!emailUser) {
        errors.push(i18n.__("APP.RESEND.ERR_EmailNotFound"));
    }
    if (emailUser && emailUser.emailConfirmed) {
        errors.push(i18n.__("APP.RESEND.ERR_EmailAlreadyConfirmed"));
    }

    if (req.body.captcha === "") {
        captchaFail = i18n.__("APP.REGISTER.ERROR.CaptchaEmpty");
    } else if (req.body.captcha !== req.session.captcha) {
        captchaFail = i18n.__("APP.REGISTER.ERROR.CaptchaMismatch");
    }

    // user is suspended and suspendedUntil is > now
    if (
        emailUser &&
        emailUser.suspended &&
        moment(emailUser.suspendedUntil).diff(moment()) > 0
    ) {
        errors.push(i18n.__("APP.RESEND.ERR_Suspended") + moment(emailUser.suspendedUntil).format("LLL"));
    }


    if (captchaFail) {
        const captcha = getCaptcha(req.session.captcha);
        return res.render("auth/resend", {
            title: i18n.__("APP.RESEND.TITLE"),
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
            title: i18n.__("APP.RESEND.TITLE"),
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
        subject: i18n.__("APP.RESEND.MAIL_SUBJECT", cfg.app.title),
        confirmURL
    });
    logger.info(
        `[App] re-sent activation email to ${chalk.yellow(
            user.email
        )} and updated user with new confirm token.`
    );
    req.flash("success", i18n.__("APP.RESEND.SUCCESS"));
    return res.redirect("/");
};
