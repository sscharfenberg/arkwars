/***********************************************************************************************************************
 *
 * userController
 *
 **********************************************************************************************************************/
const svgCaptcha = require("svg-captcha"); // https://github.com/lemonce/svg-captcha
const mongoose = require("mongoose"); // http://mongoosejs.com/
const moment = require("moment"); // https://momentjs.com/
const promisify = require("es6-promisify"); // https://www.npmjs.com/package/es6-promisify
const crypto = require("crypto"); // https://nodejs.org/api/crypto.html
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const User = mongoose.model("User");
const logger = require("../handlers/logger/console");
const mail = require("../handlers/mail");
const cfg = require("../config");


/*
 * create a SVG captcha image. =========================================================================================
 * uses random characters or a string that is passed to the fn.
 * @param {string} text - optional
 * @returns {CaptchaObj} || {SVGObj}
 */
const getCaptcha = (text = undefined) => {
    const options = {
        height: 26,
        size: 4,
        ignoreChars: "0Oo11i8B",
        noise: 0
    };
    if (text) {
        return svgCaptcha(text, options); // {SVGObj}
    } else {
        return svgCaptcha.create(options); // {CaptchaObj}
    }
};


/*
 * show registration form ==============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showRegistration = (req, res) => {
    const captcha = getCaptcha();
    req.session.captcha = captcha.text; // TODO this should be flashed, not injected into the session
    res.render("auth/register", {
        title: i18n.__("PAGE_REG_TITLE"),
        session: req.session,
        captcha: captcha.data
    });
};


/*
 * validate a POST registration request. ===============================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateRegistration = async (req, res, next) => {
    logger.info("recieved registration data: " + JSON.stringify(req.body));
    // username
    req.sanitizeBody("username").trim();
    req
        .checkBody("username", i18n.__("PAGE_REG_ERROR_UsernameEmpty"))
        .notEmpty();
    req
        .checkBody("username", i18n.__("PAGE_REG_ERROR_UsernameOutOfBounds"))
        .isLength({ min: 3, max: 20 });

    // email
    req.checkBody("email", i18n.__("PAGE_REG_ERROR_EmailEmpty")).notEmpty();
    req.checkBody("email", i18n.__("PAGE_REG_ERROR_EmailInvalid")).isEmail();
    // password
    req
        .checkBody("password", i18n.__("PAGE_REG_ERROR_PasswordEmpty"))
        .notEmpty();
    req
        .checkBody("password", i18n.__("PAGE_REG_ERROR_PasswordOutOfBounds"))
        .isLength({ min: 6, max: 32 });
    // captcha
    req.checkBody("captcha", i18n.__("PAGE_REG_ERROR_CaptchaEmpty")).notEmpty();
    req
        .checkBody("captcha", i18n.__("PAGE_REG_ERROR_CaptchaMismatch"))
        .equals(req.session.captcha);
    // accept conditions
    req
        .checkBody("accept_conditions", i18n.__("PAGE_REG_ERROR_AcceptEmpty"))
        .notEmpty();

    const validatorPromise = req.getValidationResult();
    const userPromise = User.findOne({ username: req.body.username });
    const emailPromise = User.findOne({ email: req.body.email });
    const [results, userName, email] = await Promise.all([
        validatorPromise,
        userPromise,
        emailPromise
    ]);
    let errorMap = results.mapped();
    let errorList = results.array();

    // username has already been registered.
    if (userName) {
        const error = {
            param: "username",
            msg: i18n.__("PAGE_REG_ERROR_UsernameTaken"),
            value: req.body.username
        };
        errorMap.username = error;
        errorList.push(error);
    }

    // email has already been registered.
    if (email) {
        const error = {
            param: "email",
            msg: i18n.__("PAGE_REG_ERROR_EmailTaken"),
            value: req.body.email
        };
        errorMap.email = error;
        errorList.push(error);
    }

    // check if username is blacklisted.
    if (
        cfg.app.blacklistedUsernames.includes(req.body.username.toLowerCase())
    ) {
        const error = {
            param: "username",
            msg: i18n.__("PAGE_REG_ERROR_UsernameBlacklisted"),
            value: req.body.email
        };
        errorMap.username = error;
        errorList.push(error);
        logger.debug(
            `[App] attempted registration of ${req.body
                .username}, a blacklisted username.`
        );
    }

    // if there are errors, render the template with errors.
    if (errorList.length) {
        const captcha = getCaptcha(req.session.captcha);
        logger.debug(`[App] validation errors: ${JSON.stringify(errorList)}`);
        req.flash("error", i18n.__("PAGE_REG_ERROR"));
        res.render("auth/register", {
            title: i18n.__("PAGE_REG_TITLE"),
            session: req.session,
            // svg-captcha returns the captcha directly when we provide the text, not as captcha.data
            captcha,
            data: req.body,
            errors: errorMap,
            flashes: req.flash()
        });
        return; // there where errors, abort.
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
        emailConfirmationExpires: moment().add(1, "hour")
    });
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    req.session.captcha = undefined; // cleanup
    logger.success(`[App] saved user ${chalk.red("@" + user.username)}.`);
    next(); // no errors - proceed to next middleware
};


/*
 * send confirmation email to user =====================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res

 */
exports.sendConfirmationEmail = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
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
        subject: `Welcome to ${cfg.app.title}`,
        confirmURL
    });
    logger.info(
        `[App] sent confirmation email to ${chalk.yellow(user.email)}.`
    );
    req.flash("success", i18n.__("PAGE_REG_SUCCESS"));
    res.redirect("/");
};


/*
 * confirm email request ===============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.confirmEmail = async (req, res) => {
    const user = await User.findOne({
        emailConfirmationToken: req.params.token,
        emailConfirmationExpires: { $gt: moment().toISOString() }
    });
    logger.debug(
        `[App] email confirmation request. user: ${JSON.stringify(user)}`
    );
    if (!user) {
        req.flash("error", i18n.__("REG_CONFIRM_SUCCESS"));
        return res.redirect("/auth/login");
    }

    user.emailConfirmationToken = "";
    user.emailConfirmed = true;
    await user.save();

    logger.success(
        `[App] account for ${chalk.red(
            "@" + user.username
        )} has been activated.`
    );
    req.flash("success", i18n.__("REG_CONFIRM_FAILED"));
    res.redirect("/auth/login");
};


/*
 * switch the language =================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.switchLanguage = async (req, res) => {
    const newLocale = req.params.lang;
    if (!cfg.app.locales.includes(req.params.lang)) {
        logger.error(`[App] invalid locale: ${chalk.red(newLocale)}.`);
        req.flash("error", i18n.__("APP_SWITCH_LANG_InvalidLocale"));
    } else {
        req.session.locale = newLocale;
        if (req.user) {
            const user = await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { locale: newLocale } },
                { new: true, runValidators: true, context: "query" }
            );
            logger.info(
                `[App] user ${chalk.red(
                    "@" + user.username
                )} locale updated in db to ${chalk.yellow(req.session.locale)}`
            );
        }
        req.session.save(() => {
            logger.info(
                `[App] user switched locale to ${chalk.yellow(
                    req.session.locale
                )}`
            );
        });
    }
    return res.redirect("back");
};
