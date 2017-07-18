/***********************************************************************************************************************
 *
 * userValidator
 *
 **********************************************************************************************************************/
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const mongoose = require("mongoose"); // http://mongoosejs.com/
const User = mongoose.model("User");


/*
 * default validator.js validations ====================================================================================
 * @param {ExpressHTTPRequest} req
 * @return {ExpressHTTPRequest} req
 */
exports.defaultValidators = req => {
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
    return req;
};


/*
 * User Promise ========================================================================================================
 * @param {ExpressHTTPRequest} req
 * @return {Promise}
 */
exports.userPromise = req => {
    return User.findOne({ username: req.body.username });
};


/*
 * Email Promise =======================================================================================================
 * @param {ExpressHTTPRequest} req
 * @return {Promise}
 */
exports.emailPromise = req => {
    return User.findOne({ email: req.body.email });
};


/*
 * Username already exists =============================================================================================
 * @param {ExpressHTTPRequest} req
 * @return {Object} error
 */
exports.userNameExists = req => {
    return {
        param: "username",
        msg: i18n.__("PAGE_REG_ERROR_UsernameTaken"),
        value: req.body.username
    };
};


/*
 * Email already exists ================================================================================================
 * @param {ExpressHTTPRequest} req
 * @return {Object} error
 */
exports.emailExists = req => {
    return {
        param: "email",
        msg: i18n.__("PAGE_REG_ERROR_EmailTaken"),
        value: req.body.email
    };
};


/*
 * Username already exists =============================================================================================
 * @param {ExpressHTTPRequest} req
 * @return {Object} error
 */
exports.userNameBlacklisted = req => {
    return {
        param: "username",
        msg: i18n.__("PAGE_REG_ERROR_UsernameBlacklisted"),
        value: req.body.email
    };
};
