/***********************************************************************************************************************
 *
 * gamesController
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const Game = mongoose.model("Game");
const Player = mongoose.model("Player");
const User = mongoose.model("User");
const logger = require("../../handlers/logger/console");
const enlistValidators = require("../../handlers/validators/games/enlist");
const cfg = require("../../config");

/*
 * check if user can enlist to this game ===============================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.checkCanEnlist = async (req, res, next) => {
    const game = await Game.findOne({
        number: req.params.game,
        canEnlist: true,
        startDate: { $gt: moment().toISOString() }
    });
    if (!game) {
        logger.debug(
            `[${chalk.yellow(
                "@" + req.user.username
            )}] show enlist page for ${chalk.red(
                "g" + req.params.game
            )} - game can not be enlisted.`
        );
        req.flash("error", i18n.__("GAMES.ENLIST.ERR.NotEnlistable"));
        return res.redirect("/dashboard");
    }
    req._game = game;
    next();
};

/*
 * show enlist form page ===============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showEnlistForm = (req, res) => {
    const game = req._game;
    const data = req.body;
    moment.locale(req.session.locale);
    res.render("game/enlist", {
        title: i18n.__("GAMES.ENLIST.TITLE", `g${game.number}`),
        session: req.session,
        game,
        cfg,
        data
    });
};

/*
 * validate enlist form data ===========================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateEnlistForm = async (req, res, next) => {
    // default validators
    req = enlistValidators.defaultValidators(req);
    const result = await req.getValidationResult();
    const errorList = result.array();
    if (errorList.length) {
        logger.debug(
            `[App] enlist validation errors: ${JSON.stringify(errorList)}`
        );
        req.flash("error", i18n.__("GAMES.ENLIST.ERR.Flash"));
        return res.render("game/enlist", {
            title: i18n.__("APP.REGISTER.TITLE"),
            session: req.session,
            game: req._game,
            cfg,
            data: req.body,
            errors: result.mapped(),
            flashes: req.flash()
        });
    }
    // no errors, proceed to next middleware
    logger.info(
        `[App] user ${chalk.red(
            "@" + req.user.username
        )} passed enlist validation for ${chalk.yellow("g" + req.params.game)}`
    );
    next();
};

/*
 * enlist user into game ===============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.enlistUser = async (req, res) => {
    const player = new Player({
        game: req._game._id,
        user: req.user._id,
        name: req.body.empirename,
        ticker: req.body.empireticker.toUpperCase()
    });
    await player.save();
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { players: player._id } },
        { new: true }
    );
    if (user && player) {
        logger.success(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} enlisted to ${chalk.yellow("g" + req.params.game)}.`
        );
        req.flash("success", i18n.__("GAMES.ENLIST.SUCCESS"), `g${req.params.game}`);
    } else {
        req.flash("error", i18n.__("GAMES.ENLIST.ERR.Flash"));
    }
    res.redirect("/dashboard");
};
