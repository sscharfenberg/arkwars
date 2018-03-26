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
const apiRsearchGameDataController = require("./research.gameData");
const Research = mongoose.model("Research");
const Player = mongoose.model("Player");
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
    const returnData = await apiRsearchGameDataController.fetch(req.user.selectedPlayer);
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

    // 4. make sure the number of passed research jobs is not > max
    if (req.body.length > cfg.tech.queue) {
        logger.error(
            `[App] user ${"@" +
            req.user.username} passed more research jobs than allowed.`
        );
        return res.json({error: i18n.__("API.RESEARCH.ORDER.LENGTH", cfg.tech.queue), researches: cmpDbResearches});
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
        )} deleting research job ${chalk.yellow("#"+req.body.id)}`
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

/*
 * verify "change research priority" request is valid ==================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.verifyChangePriority = async (req, res, next) => {
    // sanitize user inputs
    req.body.researchPriority = parseFloat(strip(req.body.researchPriority));
    const prio = req.body.researchPriority;
    logger.info(
        `[App] Player ${chalk.red("[" + req.user.selectedPlayer.ticker + "]"
        )} changing research priority to ${chalk.yellow(req.body.researchPriority)}`
    );
    // 1. verify priority is within expected bounds
    if (prio < cfg.tech.researchPriority[0] || prio > cfg.tech.researchPriority[1]) {
        logger.error(`[App] research priority ${chalk.yellow(prio)} is out of bounds.`);
        const bounds = `${cfg.tech.researchPriority[0]} - ${cfg.tech.researchPriority[1]}`;
        return res.json({
            error: i18n.__("API.RESEARCH.PRIORITY.OUTOFBOUNDS", bounds),
            researchPriority: req.user.selectedPlayer.researchPriority
        });
    }
    // no error so far => proceed.
    return next();
};

/*
 * do change priority ==================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.doChangePriority = async (req, res) => {
    const updatedPlayer = await Player.findOneAndUpdate(
        {_id: req.user.selectedPlayer._id},
        {$set: {researchPriority: req.body.researchPriority}},
        {new: true, runValidators: true}
    );
    if (updatedPlayer) {
        logger.success(
            `[App] Player ${chalk.red("[" + req.user.selectedPlayer.ticker + "]")} changed research priority to ${chalk.yellow(
                updatedPlayer.researchPriority
            )}.`
        );
        return res.json({researchPriority: updatedPlayer.researchPriority});
    }
    res.status(500).end();
};


/*
 * verify "start research job" request is valid ========================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.verifyStartResearch = async (req, res, next) => {
    // sanitize user inputs
    req.body.area = strip(req.body.area);
    const techLevel = req.user.selectedPlayer.tech[req.body.area];
    const researches = await Research.find({
        player: req.user.selectedPlayer
    });
    const areaResearches = researches.filter(res => res.area === req.body.area);
    const nextLevel = () => {
        if (areaResearches.length === 0) return techLevel + 1;
        return areaResearches.map(research => research.newLevel).sort((a, b) => {
            if (a > b) return -1;
            if (a < b) return 1;
            return 0;
        })[0] + 1;
    };
    req.body.newLevel = nextLevel();
    logger.info(
        `[App] Player ${chalk.red("[" + req.user.selectedPlayer.ticker + "]"
        )} add research job ${chalk.yellow(req.body.area)} ${chalk.red("TL"+req.body.newLevel)} to queue.`
    );

    // 1) Check if the area supplied exists
    const validAreas = cfg.tech.areas.map(tech => tech.area);
    if (!validAreas.includes(req.body.area)) {
        logger.error(`[App] supplied techLevel area ${chalk.yellow(req.body.area)} does not exist.`);
        return res.json({error: i18n.__("API.RESEARCH.START.AREANOTFOUND", req.body.area)});
    }

    // 2) Make sure the new level is not already researched or enqueued
    const enqueued = areaResearches.map(research => research.newLevel).includes(req.body.newLevel);
    if (techLevel >= req.body.newLevel || enqueued) {
        logger.error(`[App] new TL ${chalk.yellow(req.body.newLevel)} already researched or enqueued.`);
        return res.json({error: i18n.__("API.RESEARCH.START.ALREADYRESEARCHED", req.body.newLevel)});
    }

    // 3) Ensure new level is within bounds
    if (req.body.newLevel < cfg.tech.bounds[0] || req.body.newLevel > cfg.tech.bounds[1]) {
        logger.error(`[App] new TL ${chalk.yellow(req.body.newLevel)} is out of bounds ${chalk.red(cfg.tech.bounds.join(","))}.`);
        return res.json({error: i18n.__("API.RESEARCH.START.OUTOFBOUNDS", req.body.newLevel)});
    }

    // 4) Verify queue max length is not exceeded
    if (researches.length >= cfg.tech.queue) {
        logger.error(`[App] research queue maximum (${cfg.tech.queue}) reached.`);
        return res.json({error: i18n.__("API.RESEARCH.START.QUEUEFULL", cfg.tech.queue)});
    }

    // no error so far => proceed.
    return next();
};

/*
 * add research to database ============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.doStartResearch = async (req, res, next) => {
    const lastResearch = await Research.findOne({
        player: req.user.selectedPlayer
    }).sort({order: "desc"});
    const newResearch = new Research({
        game: req.user.selectedPlayer.game._id,
        player: req.user.selectedPlayer._id,
        area: req.body.area,
        newLevel: req.body.newLevel,
        remaining: cfg.tech.areas.find(tech => tech.area === req.body.area).costs[req.body.newLevel - 1],
        order: lastResearch && lastResearch.order ? lastResearch.order + 1 : 0
    });
    const dbResearch = await newResearch.save();
    if (dbResearch) {
        logger.success(
            `[App] Player ${chalk.red("[" + req.user.selectedPlayer.ticker + "]")} started research ${chalk.yellow(
                dbResearch.area + " TL" + dbResearch.newLevel
            )}.`
        );
        return next();
    }
    return res.json({error: "DB Error"});
};
