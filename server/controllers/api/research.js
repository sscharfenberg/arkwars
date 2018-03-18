/***********************************************************************************************************************
 *
 * apiResearchController
 *
 * @exports {ExpressController}
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const mongoose = require("mongoose"); // http://mongoosejs.com/
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const strip = require("mongo-sanitize"); // https://www.npmjs.com/package/mongo-sanitize
const Research = mongoose.model("Research");
const logger = require("../../handlers/logger/console");
const cfg = require("../../config");

/*
 * get game data =======================================================================================================
 * we do not want to send full mongoose objects to the client,
 * (there might be parts that we don't want to tell the player)
 * so we massage the data a bit.
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.getGameData = async (req, res) => {
    const player = req.user.selectedPlayer;
    const game = player.game;
    const researches = await Research.find({player: player._id}).sort({order: "asc"});

    // prepare return data ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const returnData = {
        game: {
            // only selected game props
            number: game.number,
            active: game.active,
            dimensions: game.dimensions,
            turn: game.turn,
            turnDue: game.turnDue,
            turnDuration: game.turnDuration,
            processing: game.processing
        },
        player: {
            // again, only selected props
            name: player.name,
            ticker: player.ticker
        },
        resources: [
            // un-flatten resource data into an array for VueJS
            {type: "energy", current: player.resources.energy.current, max: player.resources.energy.max},
            {type: "food", current: player.resources.food.current, max: player.resources.food.max},
            {type: "minerals", current: player.resources.minerals.current, max: player.resources.minerals.max},
            {type: "research", current: player.resources.research.current, max: player.resources.research.max}
        ],
        techLevels: [
            {type: "plasma", level: player.tech.plasma},
            {type: "railgun", level: player.tech.railgun},
            {type: "missile", level: player.tech.missile},
            {type: "laser", level: player.tech.laser},
            {type: "shields", level: player.tech.shields},
            {type: "armour", level: player.tech.armour}
        ],
        researches: researches.map(research => {
            return {
                id: research._id,
                area: research.area,
                newLevel: research.newLevel,
                order: research.order,
                remaining: research.remaining
            };
        })
    };

    logger.info(
        `[App] User ${chalk.red("@" + req.user.username)} requested ${chalk.cyan(
            "research"
        )} game data for ${chalk.yellow("g" + returnData.game.number)} ${chalk.cyan(
            "[" + returnData.player.ticker + "]"
        )} ${chalk.cyan(returnData.player.name)}`
    );

    return res.json(returnData);
};

/*
 * verify "change research order" request is valid =====================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.verifyChangeOrder = async (req, res, next) => {
    // sanitize user inputs
    req.body = req.body.map(res => {
        return {id: strip(res.id), order: strip(res.order), area: strip(res.area), newLevel: strip(res.newLevel)};
    });
    logger.info(
        `[App] Player ${chalk.red(
            "[" + req.user.selectedPlayer.ticker + "]"
        )} changing research order to ${chalk.yellow(JSON.stringify(req.body))}`
    );

    // 1. check if all research jobs are owned by the player
    const dbResearches = await Research.find({
        _id: {$in: req.body.map(res => res.id)},
        player: req.user.selectedPlayer._id
    }).sort({order: "asc"});
    const cmpDbResearches = dbResearches.map( res => {
        return {
            id: res._id,
            area: res.area,
            newLevel: res.newLevel,
            order: res.order,
            remaining: res.remaining
        };
    });
    if (cmpDbResearches.length !== req.body.length) {
        logger.error(
            `[App] user ${"@" +
                req.user.username} is not owner of all research jobs. Maybe one has finished in the meantime?`
        );
        return res.json({error: i18n.__("API.RESEARCH.ORDER.NOTOWNER"), researches: cmpDbResearches});
    }

    // 2. check if the researches are ordered [0..n]
    let counter = 0;
    let sortError = false;
    req.body.forEach( res => {
        if (res.order !== counter) sortError = true;
        counter++;
    });
    if (sortError) {
        logger.error(
            `[App] user ${"@" +
            req.user.username} requested an incorrect sort order [0..n].`
        );
        return res.json({error: i18n.__("API.RESEARCH.ORDER.SORTERROR"), researches: cmpDbResearches});
    }

    // 3. check if techLevels of the same type are in the correct order
    let skipLevelError = false;
    req.body.forEach( res => {
        if (req.body.find(job => job.area === res.area && job.newLevel < res.newLevel && job.order > res.order)) {
            skipLevelError = true;
        }
    });
    if (skipLevelError) {
        logger.error(
            `[App] user ${"@" +
            req.user.username} has techlevels of the same type in incorrect order [skipError].`
        );
        return res.json({error: i18n.__("API.RESEARCH.ORDER.TYPEORDER"), researches: cmpDbResearches});
    }

    // no error so far => proceed.
    return next();
};

/*
 * change research order ===============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.doChangeOrder = async (req, res, next) => {
    let bulkUpdates = [];
    // prepare bulk updates
    req.body.forEach(res => {
        bulkUpdates.push({
            updateOne: {
                filter: {_id: res.id},
                update: {$set: {order: res.order}}
            }
        });
    });
    // update database with new order
    const updatedResearches = await Research.bulkWrite(bulkUpdates, {ordered: true, w: 1});
    if (updatedResearches) {
        logger.info(
            `[App] Player ${chalk.red(
                "[" + req.user.selectedPlayer.ticker + "]"
            )} changed research order in ${chalk.yellow(
                "g" + req.user.selectedPlayer.game.number
            )}. matched ${chalk.yellow(updatedResearches.matchedCount)}, modified ${chalk.yellow(
                updatedResearches.modifiedCount
            )}`
        );
        next();
    }
};

/*
 * verify if delete research request is valid ==========================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.verifyDeleteResearch = async (req, res, next) => {
    // sanitize user inputs
    req.body.id = strip(req.body.id);
    logger.info(
        `[App] Player ${chalk.red("[" + req.user.selectedPlayer.ticker + "]"
        )} deleting research order ${chalk.yellow("#"+req.body.id)}`
    );

    // 1. check if the research job is owned by the player
    const dbJob = await Research.findOne({_id: req.body.id, player: req.user.selectedPlayer._id});
    if (!dbJob) {
        logger.error(`[App] could not find researchJob owned by user ${"@" + req.user.username}.`);
        return res.json({error: i18n.__("API.RESEARCH.DELETE.NOTOWNER")});
    }

    // no error so far => proceed.
    return next();
};


/*
 * delete research job =================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.doDeleteResearch = async (req, res, next) => {
    const deletedJob = await Research.findByIdAndRemove(req.body.id);
    if (deletedJob) {
        logger.success(
            `[App] Player ${chalk.red("[" + req.user.selectedPlayer.ticker + "]")} deleted research job ${chalk.yellow(
                "#" + req.body.id
            )}.`
        );
        next();
    }
};

/*
 * send current researches as JSON =====================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.sendResearches = async (req, res) => {
    // get fresh objects from database
    const newResearchesDb = await Research.find({player: req.user.selectedPlayer._id}).sort({order: "asc"});
    const newResearches = newResearchesDb.map(research => {
        return {
            id: research._id,
            area: research.area,
            newLevel: research.newLevel,
            order: research.order,
            remaining: research.remaining
        };
    });
    return res.json(newResearches);
};
