/***********************************************************************************************************************
 *
 * manageGGamesController
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const logger = require("../../handlers/logger/console");
const Game = mongoose.model("Game");
const Player = mongoose.model("Player");
const User = mongoose.model("User");
const seed = require("../../handlers/game/seed");
const cfg = require("../../config");

/*
 * show Games ==========================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.showGames = async (req, res) => {
    const page = parseInt(req.params.page, 10) || 1; // current page
    let sort = {}; // temp sort.
    let sortField = "startDate"; // default sort column
    let sortDirection = "desc"; // default sort direction
    let limit = cfg.defaultPagination.admin.games; // number of users per page
    let skip = page * limit - limit; // skip entries if we are not on page 1
    let data = req.body;
    if (req.body.sort) {
        sortField = req.body.sort.split("_")[0];
        sortDirection = req.body.sort.split("_")[1];
    } else if (req.params.sortField && req.params.sortDirection) {
        // if no post params exist, try and use url params (pagination links!)
        sortField = req.params.sortField;
        sortDirection = req.params.sortDirection;
    }
    sort[sortField] = sortDirection; // object notation for mongoose
    data.sort = `${sortField}_${sortDirection}`; // pass to pug as value of input[name=sort]

    const gamesPromise = Game.find({})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("players");
    const countPromise = Game.find({});
    const [games, count] = await Promise.all([gamesPromise, countPromise]);
    const pages = Math.ceil(count.length / limit);

    res.render("admin/games", {
        title: i18n.__("ADMIN.GAMES.TITLE"),
        session: req.session,
        games,
        page,
        pages,
        count: count.length,
        sortField,
        sortDirection,
        data
    });
};

/*
 * show Games ==========================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.showEditGame = async (req, res) => {
    let game = {};
    let title = i18n.__("ADMIN.GAME.TITLENEW");
    if (req.params.id) {
        game = await Game.findOne({ _id: req.params.id }).populate("players");
        if (!game) {
            req.flash("error", i18n.__("ADMIN.GAME.ERROR.GAMENOTFOUND"));
        } else {
            title = i18n.__("ADMIN.GAME.TITLE", game.number);
        }
    }
    res.render("admin/game", {
        session: req.session,
        title,
        game
    });
};

/*
 * prepare checkbox and date data for the next middleware ==============================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 *
 */
exports.parseCheckboxAndDates = (req, res, next) => {
    if (req.body.startDateDate && req.body.startDateTime) {
        req.body.startDate = moment(
            `${req.body.startDateDate} ${req.body.startDateTime}`
        ).toISOString();
    }
    /* set our booleans to true || false by evaluating (req.body.. !== undefined)
     * since unchecked checkboxes do not send form data and do not exist on req.body
     * we need this so you can set to false by unchecking the checkbox
     */
    req.body.active = req.body.active !== undefined;
    req.body.canEnlist = req.body.canEnlist !== undefined;
    req.body.processing = req.body.processing !== undefined;
    next();
};

/*
 * post edit an existing game ==========================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.editGame = async (req, res) => {
    const game = await Game.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
        context: "query"
    });
    logger.success(
        `[Admin ${chalk.cyan(
            "@" + req.user.username
        )}]: changed game ${chalk.red("g" + game.number)} to ${chalk.yellow(
            JSON.stringify(game, null, 2)
        )}`
    );
    req.flash("success", i18n.__("ADMIN.GAME.SUCCESS.EDIT", game.number));
    res.render("admin/game", {
        session: req.session,
        title: i18n.__("ADMIN.GAME.TITLE", game.number),
        game,
        flashes: req.flash()
    });
};

/*
 * post create a new game from req.body data ===========================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 *
 */
exports.newGame = async (req, res, next) => {
    req.body.number =
        (await Game.findOne({}).sort({ number: "desc" })).number + 1;
    const game = await new Game(req.body).save();
    console.log(game);
    logger.success(
        `[Admin ${chalk.cyan(
            "@" + req.user.username
        )}]: created new game ${chalk.red("g" + game.number)} => ${chalk.yellow(
            JSON.stringify(game, null, 2)
        )}`
    );
    req._game = game;
    req._game.density = Math.ceil(req.body.density);
    next(); // game was created, proceed to seed universe
};

/*
 * delete game request =================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.deleteGame = async (req, res) => {
    const game = await Game.findById(req.params.id).populate("players");
    const playerIds = game.players.map(player => player.id); // players enlisted in this game.
    const UserIds = game.players.map(player => player.user); // users with players enlisted in this game
    logger.info(
        `[Admin ${chalk.cyan(
            "@" + req.user.username
        )}]: deleting game ${chalk.yellow("g" + game.number)}.`
    );

    if (game.players && game.players.length) {
        logger.info(
            `[Admin ${chalk.cyan(
                "@" + req.user.username
            )}]: removing ${playerIds.length} playerIDs from users.`
        );
        // update users and remove SelectedPlayer if player is enlisted to this game
        await User.updateMany(
            { selectedPlayer: { $in: playerIds } },
            {
                $set: {
                    selectedPlayer: undefined
                }
            },
            { runValidators: true, context: "query" }
        );
        // update users and remove players entry if player is enlisted to this game
        await User.updateMany(
            { _id: { $in: UserIds } },
            {
                $pull: { players: { $in: playerIds } }
            },
            { runValidators: true, context: "query" }
        );
        // delete players
        logger.info(
            `[Admin ${chalk.cyan(
                "@" + req.user.username
            )}]: removing ${playerIds.length} players.`
        );
        await Player.deleteMany({
            _id: { $in: playerIds }
        });
    }

    const deletedGame = await Game.findByIdAndRemove(req.params.id);
    if (deletedGame) {
        logger.success(
            `[Admin ${chalk.cyan(
                "@" + req.user.username
            )}]: deleted game ${chalk.yellow("g" + deletedGame.number)}.`
        );
    }

    // TODO: notify users by email

    req.flash(
        "success",
        i18n.__("ADMIN.GAME.SUCCESS.DELETE", deletedGame.number)
    );
    res.redirect("/admin/games");
};

/*
 * seed game universe ==================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.seedGame = async (req, res) => {
    const game = req._game;
    logger.info(
        `[Admin ${chalk.cyan(
            "@" + req.user.username
        )}]: seed universe for game ${chalk.yellow("g" + game.number)}.`
    );
    console.log(seed.PlayerSystems(game, req.user));
    console.log(seed.NPCSystems(game, req.user));
    //    req.flash("success", i18n.__("ADMIN.GAME.SUCCESS.NEW", game.number));
    //    res.redirect(`/admin/games/${game.id}/edit`);
};
