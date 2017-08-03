/***********************************************************************************************************************
 *
 * ChangePasswordValidator
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

    // password is not empty.
    req
        .checkBody("password", i18n.__("APP.RESET.CHANGE.ERROR.PasswordEmpty"))
        .notEmpty();
    // password length
    req
        .checkBody(
            "password",
            i18n.__("APP.RESET.CHANGE.ERROR.PasswordOutOfBounds")
        )
        .isLength({ min: 6, max: 32 });

    // confirm password is not empty.
    req
        .checkBody(
            "passwordConfirm",
            i18n.__("APP.RESET.CHANGE.ERROR.PasswordConfirmEmpty")
        )
        .notEmpty();
    // password confirmation matches
    req
        .checkBody(
            "passwordConfirm",
            i18n.__("APP.RESET.CHANGE.ERROR.PasswordsNoMatch")
        )
        .equals(req.body.password);

    return req;
};
