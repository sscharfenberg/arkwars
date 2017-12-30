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
const promisify = require("es6-promisify"); // https://www.npmjs.com/package/es6-promisify
const {getCaptcha} = require("../../handlers/captcha");
const logger = require("../../handlers/logger/console");
const mail = require("../../handlers/mail");
const changePasswordValidators = require("../../handlers/validators/changePassword");
const User = mongoose.model("User");
const cfg = require("../../config");

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
    logger.info(
        `[App] reset password request for ${chalk.cyan(req.body.email)}`
    );
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
        errors.captcha = {msg: captchaFail};
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
    const emailUser = await User.findOne({email: req.body.email});
    if (!emailUser) {
        errors.email = {msg: i18n.__("APP.RESET.ERR_EmailNotFound")};
        logger.error(
            `[App] got reset request, could not find the email "${
                req.body.email
            }".`
        );
    }

    // check if user email has been confirmed
    if (!emailUser.emailConfirmed) {
        errors.email = {msg: i18n.__("APP.RESET.ERR_EmailNotYetConfirmed")};
        logger.error(
            `[App] got reset request, email not yet confirmed "${
                req.body.email
            }".`
        );
    }

    // user is suspended?
    const suspendedUntil = emailUser.isSuspended;
    if (suspendedUntil) {
        errors.email = {
            msg:
                i18n.__("APP.RESET.ERR_UserSuspended") +
                moment(suspendedUntil).format("LLL")
        };
        logger.error(
            `[App] got reset request, user with email "${chalk.cyan(
                req.body.email
            )}" is suspended .`
        );
    }

    if (errors.email) {
        const captcha = getCaptcha(); // new captcha to increase costs
        req.session.captcha = captcha.text;
        return res.render("auth/reset", {
            title: i18n.__("APP.RESET.TITLE"),
            session: req.session,
            data: req.body,
            errors,
            captcha: captcha.data,
            flashes: req.flash()
        });
    } else {
        req._user = emailUser;
        // no errors, proceed.
        next();
    }
};

/*
 * update reset user with a fresh token. ===============================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.updateResetUser = async (req, res, next) => {
    const user = await User.findOneAndUpdate(
        {_id: req._user._id},
        {
            $set: {
                resetPasswordToken: crypto.randomBytes(20).toString("hex"),
                resetPasswordExpires: moment().add(1, "hours")
            }
        },
        {new: true, runValidators: true, context: "query"}
    );
    if (!user) {
        logger.error(
            `[App] error updating user ${chalk.yellow(
                user.username
            )} with email ${chalk.red(user.email)}, could not set reset token.`
        );
        const captcha = getCaptcha(req.session.captcha.text);
        req.flash("error", i18n.__("APP.RESET.DB_ERROR"));
        return res.render("auth/reset", {
            title: i18n.__("APP.RESET.TITLE"),
            session: req.session,
            data: req.body,
            captcha: captcha.data,
            flashes: req.flash()
        });
    } else {
        logger.success(
            `[App] account with email ${chalk.red(
                user.email
            )} has been updated with a new reset token.`
        );
        req._user = user;
        next();
    }
};

/*
 * send password reset email ===========================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.sendResetEmail = async (req, res) => {
    const user = req._user;
    const confirmURL = `http://${req.headers.host}/auth/reset/${
        user.resetPasswordToken
    }`;
    await mail.send({
        user,
        filename: "reset_email",
        subject: i18n.__("APP.RESET.MAIL_SUBJECT", cfg.app.title),
        confirmURL,
        adminEmail: false
    });
    logger.info(`[App] sent reset email to ${chalk.yellow(user.email)}.`);
    req.flash("success", i18n.__("APP.RESET.MAIL_SENT"));
    res.redirect("/");
};

/*
 * validate reset token ================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateResetToken = async (req, res, next) => {
    logger.debug(
        `[App] password reset token validation. token: ${req.params.token}`
    );
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: {$gt: moment().toISOString()}
    });
    if (!user) {
        req.flash("error", i18n.__("APP.RESET.ERR_TOKEN"));
        logger.error(
            `[App] password reset token is ${chalk.magenta("invalid")}.`
        );
        res.redirect("/auth/reset");
    } else {
        req._user = user;
        logger.debug(
            `[App] password reset token for ${chalk.cyan(
                "@" + user.username
            )} is ${chalk.magenta("valid")}.`
        );
        next();
    }
};

/*
 * show password reset change form =====================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showChangeForm = async (req, res) => {
    res.render("auth/reset_change", {
        title: i18n.__("APP.RESET.CHANGE.TITLE"),
        session: req.session,
        data: {
            user: req._user,
            token: req.params.token
        }
    });
};

/*
 * valdiate password change request ====================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateChangeForm = async (req, res, next) => {
    logger.info(
        `[App] validating change password request for user ${chalk.magenta(
            "@" + req._user.username
        )}`
    );
    req = changePasswordValidators.defaultValidators(req); // default validators
    const validationResult = await req.getValidationResult();
    if (validationResult.array().length === 0) {
        // no errors, proceed
        next();
    } else {
        logger.error(
            `[App] form errors for change password request ${chalk.magenta(
                "@" + req._user.username
            )}. ${validationResult.array().length} errors.`
        );
        req.flash("error", i18n.__("APP.RESET.CHANGE.ERROR.FLASH"));
        return res.render("auth/reset_change", {
            title: i18n.__("APP.RESET.CHANGE.TITLE"),
            session: req.session,
            data: {
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm,
                token: req.params.token
            },
            errors: validationResult.mapped(),
            flashes: req.flash()
        });
    }
};

/*
 * update password =====================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.resetChangePassword = async (req, res) => {
    const user = req._user; // comes from validateResetToken
    const setPassword = promisify(user.setPassword, user); // setPassword needs to be promisified
    await setPassword(req.body.password);
    user.resetPasswordToken = undefined; // clear token
    user.resetPasswordExpires = undefined;
    user.attempts = 0;
    const updatedUser = await user.save(); // save to db
    if (!user.isSuspended) {
        // log in
        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            req.user = updatedUser;
            logger.info(`[App] user @${updatedUser.username} logged in.`);
            req.flash(
                "success",
                i18n.__("APP.RESET.CHANGE.SUCCESS", updatedUser.username)
            );
            res.redirect("/dashboard");
        });
    } else {
        req.flash(
            "success",
            i18n.__("APP.RESET.CHANGE.SUCCESS", updatedUser.username)
        );
        res.redirect("/auth/login");
    }
};
