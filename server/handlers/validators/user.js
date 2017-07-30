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
        .checkBody("username", i18n.__("APP.REGISTER.ERROR.UsernameEmpty"))
        .notEmpty();
    req
        .checkBody("username", i18n.__("APP.REGISTER.ERROR.UsernameOutOfBounds"))
        .isLength({ min: 3, max: 20 });

    // email
    req.checkBody("email", i18n.__("APP.REGISTER.ERROR.EmailEmpty")).notEmpty();
    req.checkBody("email", i18n.__("APP.REGISTER.ERROR.EmailInvalid")).isEmail();
    // password
    req
        .checkBody("password", i18n.__("APP.REGISTER.ERROR.PasswordEmpty"))
        .notEmpty();
    req
        .checkBody("password", i18n.__("APP.REGISTER.ERROR.PasswordOutOfBounds"))
        .isLength({ min: 6, max: 32 });
    // captcha
    req.checkBody("captcha", i18n.__("APP.REGISTER.ERROR.CaptchaEmpty")).notEmpty();
    req
        .checkBody("captcha", i18n.__("APP.REGISTER.ERROR.CaptchaMismatch"))
        .equals(req.session.captcha);
    // accept conditions
    req
        .checkBody("accept_conditions", i18n.__("APP.REGISTER.ERROR.AcceptEmpty"))
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
        msg: i18n.__("APP.REGISTER.ERROR.UsernameTaken"),
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
        msg: i18n.__("APP.REGISTER.ERROR.EmailTaken"),
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
        msg: i18n.__("APP.REGISTER.ERROR.UsernameBlacklisted"),
        value: req.body.email
    };
};
