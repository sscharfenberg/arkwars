/***********************************************************************************************************************
 *
 * profileController
 *
 **********************************************************************************************************************/
const crypto = require("crypto"); // https://nodejs.org/api/crypto.html
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const User = mongoose.model("User");
const userValidators = require("../../handlers/validators/user");
const logger = require("../../handlers/logger/console");
const mail = require("../../handlers/mail");
const cfg = require("../../config");


/*
 * show profile page ===================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showDashboard = (req, res) => {
    moment.locale(req.session.locale);
    res.render("user/dashboard", {
        title: i18n.__("APP.DASHBOARD.TITLE"),
        session: req.session,
        registered: moment(req.user.created).format("LLLL"),
        email: req.user.email
    });
};


/*
 * validate change email address post request ==========================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateChangeEmail = async (req, res, next) => {
    logger.info(
        `[App] change password post request: ${chalk.red(
            "@" + req.user.username
        )} from ${chalk.yellow(req.user.email)} to ${chalk.yellow(
            req.body.email
        )}`
    );
    // changed email validator
    req = userValidators.changedEmail(req);
    const validationResults = await req.getValidationResult();
    if (validationResults.array().length) {
        let errorMessage = validationResults.array()[0].msg;
        logger.debug(
            `[${chalk.yellow("@" + req.user.username)}] ${errorMessage}`
        );
        req.flash("error", errorMessage);
        return res.redirect("/dashboard");
    } else {
        next(); // no errors, proceed to next middleware
    }
};


/*
 * change email address request: update user ===========================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.updateEmail = async (req, res, next) => {
    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: {
            email: req.body.email,
            emailConfirmed: false,
            emailConfirmationToken: crypto.randomBytes(20).toString("hex"),
            emailConfirmationExpires: moment().add(1, "hours")
        } },
        { new: true, runValidators: true, context: "query" }
    );
    if (user) {
        logger.info(
            `[App] user ${chalk.red(
                "@" + user.username
            )} changed email in db to ${chalk.yellow(user.email)}`
        );
        req._user = user;
        next();
    } else {
        logger.error(
            `[App] error updating email in db for user ${chalk.red(
                "@" + user.username
            )}`
        );
        req.flash("error", i18n.__("APP.DASHBOARD.EMAIL.ERR.DB"));
        return res.redirect("/dashboard");
    }
};


/*
 * change email address request: send 'email updated' with activation link =============================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.sendEmailUpdated = async (req, res) => {
    console.log("send updated email");
    const user = req._user;
    const confirmURL = `http://${req.headers
        .host}/auth/confirm/${user.emailConfirmationToken}`;
    await mail.send({
        user,
        filename: "changed_email",
        subject: i18n.__("APP.DASHBOARD.EMAIL.MAIL_SUBJECT", cfg.app.title),
        confirmURL
    });
    logger.info(
        `[App] sent "email changed" mail to ${chalk.yellow(user.email)}.`
    );
    req.flash("success", i18n.__("APP.DASHBOARD.EMAIL.SUCCESS"));
    req.logout();
    res.redirect("/auth/login");
};
