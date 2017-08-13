/***********************************************************************************************************************
 *
 * gamesEnlistValidator
 *
 **********************************************************************************************************************/
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const cfg = require("../../../config");

/*
 * default validator.js validations ====================================================================================
 * @param {ExpressHTTPRequest} req
 * @return {ExpressHTTPRequest} req
 */
exports.defaultValidators = req => {
    // empirename
    req.sanitizeBody("empirename").trim();
    req
        .checkBody("empirename", i18n.__("GAMES.ENLIST.EMPIRENAME.ERR.Empty"))
        .notEmpty();
    req
        .checkBody(
            "empirename",
            i18n.__(
                "GAMES.ENLIST.EMPIRENAME.ERR.Length",
                `${cfg.games.empire.name.min} - ${cfg.games.empire.name.max}`
            )
        )
        .isLength({
            min: cfg.games.empire.name.min,
            max: cfg.games.empire.name.max
        });
    req
        .checkBody(
            "empirename",
            i18n.__("GAMES.ENLIST.EMPIRENAME.ERR.NotAlphaNum")
        )
        .matches(/^[a-z0-9äöüß\x20]+$/i); // a to z, 0 to 9, ä, ö, ü, and space

    // ticker
    req
        .checkBody(
            "empireticker",
            i18n.__("GAMES.ENLIST.EMPIRETICKER.ERR.Empty")
        )
        .notEmpty();
    req
        .checkBody(
            "empireticker",
            i18n.__(
                "GAMES.ENLIST.EMPIRETICKER.ERR.Length",
                `${cfg.games.empire.ticker.min} - ${cfg.games.empire.ticker
                    .max}`
            )
        )
        .isLength({
            min: cfg.games.empire.ticker.min,
            max: cfg.games.empire.ticker.max
        });
    req
        .checkBody(
            "empireticker",
            i18n.__("GAMES.ENLIST.EMPIRETICKER.ERR.NotAlphaNum")
        )
        .matches(/^[a-z0-9äöüß]+$/i); // a to z, 0 to 9, ä, ö, ü


    return req;
};
