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
const Star = mongoose.model("Star");
const Planet = mongoose.model("Planet");
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
        .populate("players stars");
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
        game = await Game.findOne({ _id: req.params.id }).populate(
            "players stars"
        );
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
exports.parseCheckboxes = (req, res, next) => {
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
    }).populate("players stars");
    logger.success(
        `[Admin ${chalk.cyan(
            "@" + req.user.username
        )}]: changed game ${chalk.red("g" + game.number)} to ${chalk.yellow(
            JSON.stringify(
                {
                    _id: game._id,
                    number: game.number,
                    startDate: game.startDate,
                    created: game.created,
                    turnDuration: game.turnDuration,
                    processing: game.processing,
                    active: game.active,
                    canEnlist: game.canEnlist
                },
                null,
                2
            )
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

    // delete stars
    await Planet.deleteMany({ game: req.params.id });
    // delete planets
    await Star.deleteMany({ game: req.params.id });

    // finally, delete the game
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
    if (!game) {
        logger.error(
            `[Admin ${chalk.cyan(
                "@" + req.user.username
            )}]: failed to create new game`
        );
        res.render("admin/game", {
            session: req.session,
            title: i18n.__("ADMIN.GAME.TITLENEW"),
            game: req.body,
            flashes: req.flash()
        });
    } else {
        logger.success(
            `[Admin ${chalk.cyan(
                "@" + req.user.username
            )}]: created new game ${chalk.red(
                "g" + game.number
            )} => ${chalk.yellow(JSON.stringify(game, null, 2))}`
        );
        req.flash("success", i18n.__("ADMIN.GAME.SUCCESS.NEW", game.number));
        res.redirect(`/admin/games/${game.id}/seed`);
    }
};

/*
 * show seed game form =================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.showSeedGame = async (req, res) => {
    const game = await Game.findOne({ _id: req.params.id }).populate("stars");
    if (!game) {
        req.flash("error", i18n.__("ADMIN.GAME.ERROR.GAMENOTFOUND"));
        res.redirect("back");
    }
    if (game.stars.length) {
        req.flash(
            "error",
            i18n.__("ADMIN.GAME.SEED.ERROR.AlreadySeeded", game.number)
        );
        res.redirect("back");
    }
    res.render("admin/game-seed", {
        session: req.session,
        title: i18n.__("ADMIN.GAME.SEED.TITLE", game.number),
        game
    });
};

/*
 * create seed game preview ============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.seedGamePreview = async (req, res) => {
    const game = await Game.findOne({ _id: req.params.id });
    let map = [];
    game.dimensions = req.body.dimensions || cfg.games.dimensions.default;

    logger.info(
        `[Admin ${chalk.cyan(
            "@" + req.user.username
        )}]: seed universe for game ${chalk.yellow("g" + game.number)}.`
    );

    /*
     * we generate npc stars and player stars seperately. this ensures the distances set
     * are enforced. it leads to slight clumping though, player systems can be right beside
     * npc systems. this is fine though, player distance enforcement is more important
     */
    let stars = seed.systems(
        game,
        req.user,
        req.body.distanceMin,
        req.body.distanceMax
    );
    let playerStars = seed.systems(
        game,
        req.user,
        req.body.playerDistanceMin,
        req.body.playerDistanceMax
    );
    // set the type accordingly
    stars = stars.map(star => [star[0], star[1], 1]); // set to npc system by default.
    playerStars = playerStars.map(star => [star[0], star[1], 2]); // set to player system.
    // player systems first, npc systems last.
    let allStars = playerStars
        .concat(stars)
        .sort((a, b) => (a[0] === b[0] ? 0 : a[0] < b[0] ? -1 : 1)); // sort by row value / x
    logger.info(
        `[App] generated ${chalk.magenta(
            allStars.length
        )} stars total - ${chalk.yellow(stars.length)} npc systems, ${chalk.red(
            playerStars.length
        )} player home systems.`
    );

    let seen = [];
    let starsFiltered = allStars.filter(star => {
        // convert the coords array to a string, since javascript arrays (objects)
        // are compared by reference, not by value
        // therefore, we can not simply compare arrays by using indexOf
        let coordSeen = `${star[0]}/${star[1]}`;
        if (seen.indexOf(coordSeen) > -1) return false;
        seen.push(coordSeen);
        return true;
    });

    logger.info(
        `[App] ${chalk.red(
            allStars.length - starsFiltered.length
        )} duplicates removed, ${chalk.yellow(starsFiltered.length)} remaining.`
    );

    // scaffold map array with empty sectors
    for (let i = 0; i < game.dimensions; i++) {
        map.push(new Array(game.dimensions).fill(0));
    }
    let numPlayerSys = 0;
    let numEmptySys = 0;
    // prepare the ascii map as preview. 0 = empty, 1 = npc, 2 = player
    starsFiltered.forEach(star => {
        map[star[0]][star[1]] = star[2]; // set marker for star
        if (star[2] === 1) numEmptySys++;
        if (star[2] === 2) numPlayerSys++;
    });

    // store the seeded map
    let savedGame = await Game.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                seededMap: JSON.stringify(starsFiltered),
                dimensions: game.dimensions
            }
        },
        { new: true, runValidators: true, context: "query" }
    );

    if (savedGame) {
        logger.info(`[App] saved seeded map in database for re-use.`);
        savedGame.dimensions = game.dimensions;
    } else {
        logger.error(`[App] failed to save seeded map in database.`);
    }

    res.render("admin/game-seed", {
        session: req.session,
        title: i18n.__("ADMIN.GAME.SEED.TITLE", game.number),
        data: req.body,
        game: savedGame ? savedGame : game,
        map: {
            points: map,
            numEmptySys,
            numPlayerSys
        }
    });
};

/*
 * randomly generate stars and save to db ==============================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 *
 */
exports.createStars = async (req, res, next) => {
    let game = await Game.findOne({ _id: req.params.id });
    let points = JSON.parse(game.seededMap);
    let stars = [];
    points.forEach(point => {
        let spectral = seed.randomType(point[2], cfg.stars.spectralTypes);
        let star = {
            name: seed.getStarName(spectral),
            game: req.params.id,
            coordX: point[0],
            coordY: point[1],
            homeSystem: point[2] === 2 ? true : undefined,
            spectral
        };
        stars.push(star);
    });
    logger.info(
        `[App] prepared stats for ${chalk.yellow(stars.length)} star systems.`
    );
    await Star.insertMany(stars);
    // insertMany does not return the new objects, so we need to find them again
    req._stars = await Star.find({ game: req.params.id });
    logger.info(
        `[App] saved ${chalk.red(req._stars.length)} star systems in database.`
    );
    next(); // no exceptions, proceed.
};

/*
 * randomly generate planets and save to db ============================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 *
 */
exports.createPlanets = async (req, res, next) => {
    let stars = req._stars;
    let planetsToCreate = [];
    let maxPlayers = stars.filter(star => star.homeSystem).length;

    stars.forEach(star => {
        let owner = star.homeSystem ? 2 : 1;
        let numPlanets = seed.getNumPlanets(
            star.spectral,
            owner,
            cfg.stars.spectralTypes
        );
        for (let counter = 0; counter < numPlanets; counter++) {
            planetsToCreate.push({
                game: req.params.id,
                star: star.id,
                type: seed.randomType(owner, cfg.planets.types)
            });
        }
    });

    await Planet.insertMany(planetsToCreate);
    logger.info(
        `[App] generated and saved ${chalk.red(
            planetsToCreate.length
        )} planets for ${chalk.yellow(stars.length)} star systems.`
    );

    // store the seeded map
    await Game.findOneAndUpdate(
        { _id: req.params.id },
        {
            $set: {
                seededMap: undefined,
                maxPlayers
            }
        },
        { new: true, runValidators: true, context: "query" }
    );

    req.flash("success", i18n.__("ADMIN.GAME.SEED.SUCCESS"));
    res.redirect(`/admin/games/${req.params.id}/edit`);
};
