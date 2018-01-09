/***********************************************************************************************************************
 *
 * gameController
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const strip = require("mongo-sanitize"); // https://www.npmjs.com/package/mongo-sanitize
const Game = mongoose.model("Game");
const Player = mongoose.model("Player");
const User = mongoose.model("User");
const Star = mongoose.model("Star");
const logger = require("../../handlers/logger/console");
const seed = require("../../handlers/game/seed");
const {userHasPlayerInGame} = require("../../handlers/validators/authorized");
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
        number: strip(req.params.game),
        canEnlist: true,
        startDate: {$gt: moment().toISOString()}
    }).populate("players");

    if (!game || game.maxPlayers <= game.players.length) {
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
    const validatorPromise = req.getValidationResult();
    const tickerPromise = enlistValidators.tickerPromise(req);
    const namePromise = enlistValidators.namePromise(req);

    const [results, existingTicker, existingName] = await Promise.all([
        validatorPromise,
        tickerPromise,
        namePromise
    ]);
    let errorMap = results.mapped();
    let errorList = results.array();

    // ticker is already taken.
    if (existingTicker) {
        const errors = enlistValidators.tickerExists(req);
        errorMap.empireticker = errors;
        errorList.push(errors);
    }

    // name is already taken.
    if (existingName) {
        const errors = enlistValidators.nameExists(req);
        errorMap.empirename = errors;
        errorList.push(errors);
    }

    if (errorList.length) {
        logger.debug(
            `[App] enlist validation errors: ${JSON.stringify(errorList)}`
        );
        req.flash("error", i18n.__("GAMES.ENLIST.ERR.Flash"));
        return res.render("game/enlist", {
            title: i18n.__("GAMES.ENLIST.TITLE"),
            session: req.session,
            game: req._game,
            cfg,
            data: req.body,
            errors: errorMap,
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
 * @param {callback} next
 */
exports.enlistUser = async (req, res, next) => {
    const player = new Player({
        game: req._game._id,
        user: req.user._id,
        name: strip(req.body.empirename),
        ticker: strip(req.body.empireticker.toUpperCase())
    });
    req._player = await player.save();
    next();
};

/*
 * assign a home system to the player ==================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.assignHomeSystem = async (req, res) => {
    const game = await Game.findById(req._player.game).populate("stars");
    const availableStars = game.stars.filter(star => {
        return star.homeSystem && !star.owner;
    });
    logger.info(
        `[App] select random star from ${chalk.yellow(
            availableStars.length
        )} available stars.`
    );
    const homeSystem = seed.assignRandomStar(availableStars);
    logger.info(
        `[App] Decided on using Star ${chalk.cyan(
            homeSystem.name
        )} as home system for player ${chalk.magenta(req._player.name)}.`
    );
    const updatatedStar = await Star.findOneAndUpdate(
        {_id: homeSystem.id},
        {$set: {owner: req._player._id}},
        {new: true, runValidators: true, context: "query"}
    );
    if (updatatedStar) {
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
    const requestedGame = strip(req.params.game);
    const myGames = req.user.players.map(game => game.game);
    const game = await Game.findOne({
        number: requestedGame,
        _id: {$in: myGames}, // in my game ids.
        active: true // needs to be active to select
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
        game: req._game._id,
        user: req.user._id
    });
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {$set: {selectedPlayer: player._id}},
        {new: true, runValidators: true, context: "query"}
    );
    if (!updatedUser) {
        logger.debug(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} failed to select ${chalk.yellow("g" + requestedGameNumber)}`
        );
        req.flash(
            "error",
            i18n.__(
                "GAMES.CHANGE.ERR",
                `<strong>g${requestedGameNumber}</strong>`
            )
        );
        return res.redirect("back");
    } else {
        logger.success(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} selected ${chalk.yellow("g" + requestedGameNumber)}`
        );
        //req.flash(
        //    "success",
        //    i18n.__(
        //        "GAMES.CHANGE.SUCCESS",
        //        `<strong>g${requestedGameNumber}</strong>`
        //    )
        //);
        return res.redirect(`/game/${requestedGameNumber}/empire`);
    }
};

/*
 * validate if user is allowed to withdraw enlistment ==================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateWithdraw = async (req, res, next) => {
    const requestedGameNumber = strip(req.params.game);
    // prepare an array of my game ids
    const myGames = req.user.players.map(player => player.game.id);
    const game = await Game.findOne({
        number: requestedGameNumber, // number from url param
        _id: {$in: myGames} // id of game is in myGames array
    });
    if (!game) {
        logger.debug(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} failed to withdraw enlistment from ${chalk.yellow(
                "g" + requestedGameNumber
            )}`
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

    const removedPlayer = await Player.findOneAndRemove({
        user: req.user.id,
        game: req._game.id // from previous middleware
    }).populate("stars");
    // set selectedPlayer to null if the enlisted game is selected
    if (req._game.id === req.user.selectedPlayer) {
        await User.findByIdAndUpdate(
            req.user._id,
            {$set: {selectedPlayer: null}},
            {new: false, runValidators: true, context: "query"}
        );
    }
    // remove ownership of stars if necessary
    if (removedPlayer.stars && removedPlayer.stars.length) {
        await Star.updateMany(
            {owner: removedPlayer.id},
            {$set: {owner: null}},
            {runValidators: true, context: "query"}
        );
    }
    if (!removedPlayer) {
        logger.debug(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} failed to withdraw enlistment from ${chalk.yellow(
                "g" + req._game.number
            )}`
        );
        req.flash("error", i18n.__("GAMES.WITHDRAW.ERR", req._game.number));
    } else {
        logger.success(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} withdrew enlistment from ${chalk.yellow("g" + req._game.number)}`
        );
        req.flash(
            "success",
            i18n.__("GAMES.WITHDRAW.SUCCESS", req._game.number),
            `g${req._game.number}`
        );
    }
    return res.redirect("back");
};

/*
 * verify the requested game exists and the current user has a player in the game ======================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.verifyGameAuth = async (req, res, next) => {
    const requestedGameNumber = strip(req.params.game);
    const chosenGame = await Game.findOne({number: requestedGameNumber});
    if (!chosenGame) {
        req.flash(
            "error",
            i18n.__("GAME.STATUS.DoesNotExist", requestedGameNumber)
        );
        return res.redirect("back");
    }
    if (
        !userHasPlayerInGame(
            `${chosenGame._id}`,
            req.user.players.map(player => player.game.id)
        )
    ) {
        logger.debug(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} tried to access a resource but has no player in game ${chalk.yellow(
                "g" + requestedGameNumber
            )}`
        );
        req.flash(
            "error",
            i18n.__("APP.AUTH.NO_GAME_MEMBER", requestedGameNumber)
        );
        return res.redirect("back");
    }
    next(); // not returned by now => proceed to next middleware.
};
