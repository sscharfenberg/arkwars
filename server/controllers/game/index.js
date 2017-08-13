/***********************************************************************************************************************
 *
 * gameController
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
const enlistValidators = require("../../handlers/validators/game/enlist");
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
    }); // TODO: add check if already enlisted?
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
        {
            $addToSet: { players: player._id },
            $set: { selectedPlayer: player._id }
        },
        { new: true }
    );
    if (user && player) {
        logger.success(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} enlisted to ${chalk.yellow("g" + req.params.game)}.`
        );
        req.flash(
            "success",
            i18n.__("GAMES.ENLIST.SUCCESS"),
            `g${req.params.game}`
        );
    } else {
        logger.debug(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} failed to enlist to ${chalk.yellow("g" + req.params.game)}.`
        );
        req.flash("error", i18n.__("GAMES.ENLIST.ERR.Flash"));
    }
    res.redirect("/dashboard");
};

/*
 * validate if user is allowed to select a game ========================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateGameSelect = async (req, res, next) => {
    // User.players gets populated with players object, which includes game id.
    const requestedGame = req.params.game;
    const myGames = req.user.players.map(game => game.game);
    const game = await Game.findOne({
        number: requestedGame,
        _id: { $in: myGames } // in my game ids.
    });
    if (!game) {
        logger.debug(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} failed to select ${chalk.yellow("g" + requestedGame)}`
        );
        req.flash(
            "error",
            i18n.__("GAMES.CHANGE.ERR", `<strong>g${requestedGame}</strong>`)
        );
        return res.redirect("back"); // stop further execution and redirect back.
    }
    req._game = game; // remember for next middleware
    next(); // no errors, proceed.
};


/*
 * select the game =====================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.selectGame = async (req, res) => {
    const requestedGameNumber = req._game.number;
    const player = await Player.findOne({
        game: req._game._id
    });
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { selectedPlayer: player._id } },
        { new: true, runValidators: true, context: "query" }
    );
    if (!updatedUser) {
        logger.debug(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} failed to select ${chalk.yellow("g" + requestedGameNumber)}`
        );
        req.flash(
            "error",
            i18n.__("GAMES.CHANGE.ERR", `<strong>g${requestedGameNumber}</strong>`)
        );
        return res.redirect("back");
    } else {
        logger.success(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} selected ${chalk.yellow("g" + requestedGameNumber)}`
        );
        req.flash(
            "success",
            i18n.__("GAMES.CHANGE.SUCCESS", `<strong>g${requestedGameNumber}</strong>`)
        );
        return res.redirect(`/game/${requestedGameNumber}`);
    }

};

/*
 * validate if user is allowed to withdraw enlistment ==================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateWithdraw = async (req, res, next) => {
    const requestedGameNumber = req.params.game;
    // prepare an array of my game ids
    const myGames = req.user.players.map(player => player.game.id);
    const game = await Game.findOne({
        number: requestedGameNumber, // number from url param
        _id: { $in: myGames } // id of game is in myGames array
    });
    if (!game) {
        logger.debug(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} failed to withdraw enlistment from ${chalk.yellow("g" + requestedGameNumber)}`
        );
        req.flash("error", i18n.__("GAMES.WITHDRAW.ERR"));
        return res.redirect("back");
    }
    req._game = game; // remember for next middleware
    next(); // no errors, proceed.
};

/*
 * withdraw enlisted user by updating user and player ==================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.withdrawEnlistedUser = async (req, res) => {
    // we only need to remove the player.
    // Because of the relationship between User.players / User.selectedPlayer and the Player,
    // Mongoose will automatically remove the Player.id from User.players
    // and set User.selectedPlayer to null if this Player was selected.
    // i need to buy a beer for the person that thought this up, this is awesome.

    const removedPlayer = await Player.findOneAndRemove({
        user: req.user.id,
        game: req._game.id // from previous middleware
    });
    const updatedPlayersUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { players: removedPlayer.id },
            $set: { selectedPlayer: null }
        },
        { new: true }
    );

    if (!removedPlayer || !updatedPlayersUser) {
        logger.debug(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} failed to withdraw enlistment from ${chalk.yellow("g" + req._game.number)}`
        );
        req.flash("error", i18n.__("GAMES.WITHDRAW.ERR"));
    } else {
        logger.success(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} withdrew enlistment from ${chalk.yellow("g" + req._game.number)}`
        );
        req.flash("success", i18n.__("GAMES.WITHDRAW.SUCCESS"), `g${req._game.number}`);
    }
    return res.redirect("back");
};
