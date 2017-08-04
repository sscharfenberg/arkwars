/***********************************************************************************************************************
 *
 * user/registrationController
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const moment = require("moment"); // https://momentjs.com/
const promisify = require("es6-promisify"); // https://www.npmjs.com/package/es6-promisify
const crypto = require("crypto"); // https://nodejs.org/api/crypto.html
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const User = mongoose.model("User");
const { getCaptcha } = require("../../handlers/captcha");
const logger = require("../../handlers/logger/console");
const userValidators = require("../../handlers/validators/user");
const mail = require("../../handlers/mail");
const cfg = require("../../config");


/*
 * show registration form ==============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showRegistration = (req, res) => {
    const captcha = getCaptcha();
    req.session.captcha = captcha.text;
    res.render("auth/register", {
        title: i18n.__("APP.REGISTER.TITLE"),
        session: req.session,
        captcha: captcha.data,
        flashes: req.flash()
    });
};


/*
 * validate a POST registration request. ===============================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateRegistration = async (req, res, next) => {
    const captcha = getCaptcha(req.session.captcha);
    logger.info(`recieved registration data: { 
  username: ${req.body.username}
  email: ${req.body.email}
  accept: ${req.body.accept_conditions}
}`);

    // default validators
    req = userValidators.defaultValidators(req);

    const validatorPromise = req.getValidationResult();

    const userPromise = userValidators.userPromise(req);
    const emailPromise = userValidators.emailPromise(req);
    const [results, existingUser, existingEmail] = await Promise.all([
        validatorPromise,
        userPromise,
        emailPromise
    ]);
    let errorMap = results.mapped();
    let errorList = results.array();

    // username has already been registered.
    if (existingUser) {
        const errors = userValidators.userNameExists(req);
        errorMap.username = errors;
        errorList.push(errors);
    }

    // email has already been registered.
    if (existingEmail) {
        const errors = userValidators.emailExists(req);
        errorMap.email = errors;
        errorList.push(errors);
    }

    // check if username is blacklisted.
    if (
        cfg.app.blacklistedUsernames.includes(req.body.username.toLowerCase())
    ) {
        const error = userValidators.userNameBlacklisted(req);
        errorMap.username = error;
        errorList.push(error);
        logger.debug(
            `[App] attempted registration of ${req.body
                .username}, a blacklisted username.`
        );
    }

    if(errorMap.captcha) {
        const captchaError = {
            param: errorMap.captcha.param,
            msg: errorMap.captcha.msg,
            value: errorMap.captcha.value
        };
        logger.debug(`[App] captcha error: ${JSON.stringify(captchaError)}`);
        req.flash("error", i18n.__("APP.REGISTER.ERROR.FLASH"));
        return res.render("auth/register", {
            title: i18n.__("APP.REGISTER.TITLE"),
            session: req.session,
            // svg-captcha returns the captcha directly when we provide the text, not as captcha.data
            captcha,
            data: req.body,
            errors: {captcha: captchaError}, // only pass the captcha error if it fails.
            flashes: req.flash()
        });
    } else if (errorList.length) { // if there are errors, render the template with errors.
        logger.debug(`[App] validation errors: ${JSON.stringify(errorList)}`);
        req.flash("error", i18n.__("APP.REGISTER.ERROR.FLASH"));
        return res.render("auth/register", {
            title: i18n.__("APP.REGISTER.TITLE"),
            session: req.session,
            // svg-captcha returns the captcha directly when we provide the text, not as captcha.data
            captcha,
            data: req.body,
            errors: errorMap,
            flashes: req.flash()
        });
    }

    next(); // there where no errors - proceed to next middleware
};


/*
 * register user in the database =======================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.doRegistration = async (req, res, next) => {
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        locale: req.session.locale || "en",
        emailConfirmationToken: crypto.randomBytes(20).toString("hex"),
        emailConfirmationExpires: moment().add(1, "hours")
    });
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    req.session.captcha = undefined; // cleanup
    req._user = user;
    logger.success(`[App] saved user ${chalk.red("@" + user.username)}.`);
    next(); // no errors - proceed to next middleware
};


/*
 * send confirmation email to user =====================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res

 */
exports.sendConfirmationEmail = async (req, res) => {
    const user = req._user;
    if (!user) {
        req.flash("error", "Something went wrong registering your account");
        logger.error(
            `[App] Could not find the user "${req.body
                .username}" by email "${req.body.email}" after registering.`
        );
        return res.redirect("/auth/register");
    }

    const confirmURL = `http://${req.headers
        .host}/auth/confirm/${user.emailConfirmationToken}`;
    await mail.send({
        user,
        filename: "confirm_email",
        subject: i18n.__("APP.REGISTER.MAIL_SUBJECT", cfg.app.title),
        confirmURL
    });
    logger.info(
        `[App] sent confirmation email to ${chalk.yellow(user.email)}.`
    );
    req.flash("success", i18n.__("APP.REGISTER.SUCCESS"));
    res.redirect("/");
};


/*
 * confirm email request ===============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
  * @param {callback} next
 */
exports.confirmEmail = async (req, res, next) => {
    const user = await User.findOne({
        emailConfirmationToken: req.params.token,
        emailConfirmationExpires: { $gt: moment().toISOString() }
    });
    logger.debug(
        `[App] email confirmation request. token: ${req.params.token}`
    );
    if (!user) {
        req.flash("error", i18n.__("APP.REGISTER.CONFIRM_FAILED"));
        res.redirect("/auth/login");
        return;
    }

    user.emailConfirmationToken = undefined; // clear email confirmation. this deletes the mongoDB property
    user.emailConfirmationExpires = undefined;
    user.emailConfirmed = true;
    await user.save();
    logger.success(
        `[App] account for ${chalk.red(
            "@" + user.username
        )} has been activated.`
    );

    // log in
    req.login(user, function(err) {
        if (err) {
            return next(err);
        }
        req.user = user;
        logger.info(`[App] user @${user.username} logged in.`);
        req.flash("success", i18n.__("APP.REGISTER.CONFIRM_SUCCESS"));
        res.redirect("/dashboard");
    });
};
