/***********************************************************************************************************************
 *
 * gamesEnlistValidator
 *
 **********************************************************************************************************************/
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const mongoose = require("mongoose"); // http://mongoosejs.com/
const Player = mongoose.model("Player");
const cfg = require("../../../config");

/*
 * default validator.js validations ====================================================================================
 * @param {ExpressHTTPRequest} req
 * @return {ExpressHTTPRequest} req
 */
exports.defaultValidators = req => {
    // empirename
    req.sanitizeBody("empirename").trim();
    req.checkBody("empirename", i18n.__("GAMES.ENLIST.EMPIRENAME.ERR.Empty")).notEmpty();
    req
        .checkBody(
            "empirename",
            i18n.__("GAMES.ENLIST.EMPIRENAME.ERR.Length", `${cfg.player.name.bounds[0]} - ${cfg.player.name.bounds[1]}`)
        )
        .isLength({
            min: cfg.player.name.bounds[0],
            max: cfg.player.name.bounds[1]
        });
    // a to z, 0 to 9, ä, ö, ü, -, _ and space
    req.checkBody("empirename", i18n.__("GAMES.ENLIST.EMPIRENAME.ERR.NotAlphaNum")).matches(/^[a-z0-9ä_\-öüß\x20]+$/i);

    // ticker
    req.checkBody("empireticker", i18n.__("GAMES.ENLIST.EMPIRETICKER.ERR.Empty")).notEmpty();
    req
        .checkBody(
            "empireticker",
            i18n.__(
                "GAMES.ENLIST.EMPIRETICKER.ERR.Length",
                `${cfg.player.ticker.bounds[0]} - ${cfg.player.ticker.bounds[1]}`
            )
        )
        .isLength({
            min: cfg.player.ticker.bounds[0],
            max: cfg.player.ticker.bounds[1]
        });
    // a to z, 0 to 9, ä, ö, ü
    req.checkBody("empireticker", i18n.__("GAMES.ENLIST.EMPIRETICKER.ERR.NotAlphaNum")).matches(/^[a-z0-9äöüß]+$/i);

    return req;
};

/*
 * Ticker Promise: Does the ticker exist in this game? =================================================================
 * @param {ExpressHTTPRequest} req
 * @return {Promise}
 */
exports.tickerPromise = req => {
    return Player.findOne({
        ticker: req.body.empireticker.toUpperCase(),
        game: req._game._id
    });
};

/*
 * Name Promise: Does the name exist in this game? =====================================================================
 * @param {ExpressHTTPRequest} req
 * @return {Promise}
 */
exports.namePromise = req => {
    return Player.findOne({
        name: req.body.empirename,
        game: req._game._id
    });
};

/*
 * Ticker already exists ===============================================================================================
 * @param {ExpressHTTPRequest} req
 * @return {Object} error
 */
exports.tickerExists = req => {
    return {
        param: "empireticker",
        msg: i18n.__("GAMES.ENLIST.EMPIRETICKER.ERR.NotUnique"),
        value: req.body.empireticker
    };
};

/*
 * Name already exists =================================================================================================
 * @param {ExpressHTTPRequest} req
 * @return {Object} error
 */
exports.nameExists = req => {
    return {
        param: "empirename",
        msg: i18n.__("GAMES.ENLIST.EMPIRENAME.ERR.NotUnique"),
        value: req.body.empirename
    };
};
