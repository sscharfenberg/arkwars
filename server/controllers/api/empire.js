/***********************************************************************************************************************
 *
 * apiEmpireController
 *
 * @exports {ExpressController} pulse
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const mongoose = require("mongoose"); // http://mongoosejs.com/
const strip = require("mongo-sanitize"); // https://www.npmjs.com/package/mongo-sanitize
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const apiEmpireGameDataController = require("./empire.gameData");
const Planet = mongoose.model("Planet");
const Player = mongoose.model("Player");
const Star = mongoose.model("Star");
const Harvester = mongoose.model("Harvester");
const Pdu = mongoose.model("Pdu");
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
    const returnData = await apiEmpireGameDataController.fetch(req.user.selectedPlayer);
    logger.info(
        `[App] User ${chalk.red("@" + req.user.username)} requested ${chalk.cyan(
            "empire"
        )} game data for ${chalk.yellow("g" + returnData.game.number)} ${chalk.cyan(
            "[" + returnData.player.ticker + "]"
        )} ${chalk.cyan(returnData.player.name)}`
    );
    return res.json(returnData);
};

/*
 * XHR POST save star name =============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.saveStarName = async (req, res) => {
    const playerStars = req.user.selectedPlayer.stars.map(star => star.id);
    logger.info(
        `[App] Player ${chalk.red(
            "[" + req.user.selectedPlayer.ticker + "]"
        )} requesting name change of star ${chalk.yellow(req.body.id)} to ${chalk.cyan(req.body.name)}`
    );
    // don't trust the client.
    if (!playerStars.includes(req.body.id)) {
        logger.error(`[App] user ${req.user.username} is not owner of the star.`);
        return res.json({error: i18n.__("API.EMPIRE.STAR.NOTOWNER")});
    }
    if (req.body.name.length < cfg.stars.name.bounds[0] || req.body.name.length > cfg.stars.name.bounds[1]) {
        logger.error(`[App] star name ${req.body.name} length is out of bounds.`);
        return res.json({error: i18n.__("API.EMPIRE.STAR.LENGTH")});
    }
    const updatedStar = await Star.findOneAndUpdate(
        {_id: strip(req.body.id)},
        {$set: {name: strip(req.body.name)}},
        {new: true, runValidators: true}
    );
    if (updatedStar) {
        logger.success(
            `[App] name of star ${chalk.yellow(req.body.id)} was changed to ${chalk.cyan(updatedStar.name)}.`
        );
        return res.status(200).json({data: {name: updatedStar.name}});
    } else {
        logger.success(`[App] error saving name.`);
        return res.status(500).json({error: "error while saving to database."});
    }
};

/*
 * check if XHR POST install harvester is valid ========================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.checkInstallHarvester = async (req, res, next) => {
    const harvesterType = strip(req.body.harvesterType);
    const planetId = strip(req.body.planet);
    logger.info(
        `[App] Player ${chalk.red("[" + req.user.selectedPlayer.ticker + "]")} installing ${chalk.yellow(
            harvesterType
        )} harvester on planet ${chalk.cyan("#" + planetId)}`
    );
    // 1. check if the planet belongs to one of the player stars
    const playerStars = req.user.selectedPlayer.stars.map(star => star._id);
    const planet = await Planet.findOne({star: {$in: playerStars}, _id: planetId}).populate("harvesters");
    if (!planet) {
        logger.error(`[App] user ${req.user.username} is not owner of the planet.`);
        return res.json({error: i18n.__("API.EMPIRE.HARVESTER.NOTOWNER")});
    }
    // 2. verify that the player has sufficient resources to pay the build cost
    let fundsError = false;
    const buildCosts = cfg.harvesters.types.filter(harvester => harvester.type === harvesterType).shift().costs;
    buildCosts.forEach(slot => {
        const stockpile = req.user.selectedPlayer.resources[slot.resourceType].current;
        if (slot.amount > stockpile) fundsError = true;
    });
    if (fundsError) {
        logger.error(`[App] user ${req.user.username} has insufficient funds to install harvester.`);
        return res.json({error: i18n.__("API.EMPIRE.HARVESTER.FUNDS")});
    }
    // 3. verify that the planet has slots available for the resource type
    const numSlots = planet.resources.find(slot => slot.resourceType === harvesterType).slots;
    const installed = planet.harvesters.filter(harvester => harvester.resourceType === harvesterType).length;
    if (installed >= numSlots) {
        const msg = `no ${harvesterType} slots available on planet (slots: ${numSlots}, installed: ${installed}).`;
        logger.error(`[App] ${msg}`);
        return res.json({error: i18n.__("API.EMPIRE.HARVESTER.SLOTS")});
    }
    // no error so far => proceed.
    return next();
};

/*
 * do install harvester ================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.installHarvester = async (req, res) => {
    const harvesterType = strip(req.body.harvesterType);
    const planetid = strip(req.body.planet);
    const turns = cfg.harvesters.types.filter(harvester => harvester.type === harvesterType).shift().duration;
    // create new harvester
    const harvester = new Harvester({
        planet: planetid,
        game: req.user.selectedPlayer.game._id,
        owner: req.user.selectedPlayer._id,
        resourceType: harvesterType,
        turnsUntilComplete: turns
    });
    // get the new values for resources
    const buildCosts = cfg.harvesters.types.find(harvester => harvester.type === harvesterType).costs;
    let set = {};
    buildCosts.forEach(resource => {
        set["resources." + resource.resourceType + ".current"] =
            req.user.selectedPlayer.resources[resource.resourceType].current - resource.amount;
    });
    const harvesterPromise = harvester.save();
    const playerPromise = Player.findOneAndUpdate(
        {_id: req.user.selectedPlayer._id},
        {$set: set},
        {new: true, runValidators: true}
    );
    const [newHarvester, updatedPlayer] = await Promise.all([harvesterPromise, playerPromise]);

    if (!updatedPlayer) {
        logger.error(`[App] error saving build costs for harvester.`);
    }
    if (!newHarvester) {
        logger.error(`[App] error saving new harvester to db.`);
    }
    updatedPlayer &&
        newHarvester &&
        logger.success(
            `[App] player ${chalk.red(req.user.selectedPlayer.ticker)} ${"@" +
                req.user.username} installed a ${chalk.yellow(harvesterType)} harvester on Planet ${chalk.cyan(
                "#" + planetid
            )}`
        );

    return res.status(200).json({id: newHarvester._id, turnsUntilComplete: turns});
};

/*
 * check if XHR POST build PDUs is valid ===============================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.checkBuildPdu = async (req, res, next) => {
    const pduType = strip(req.body.type);
    const planetId = strip(req.body.planet);
    const amount = strip(req.body.amount);
    logger.info(
        `[App] Player ${chalk.red("[" + req.user.selectedPlayer.ticker + "]")} constructing ${chalk.red(
            amount
        )} ${chalk.yellow(pduType)} PDUs on planet ${chalk.cyan("#" + planetId)}`
    );
    // 1. check if the planet belongs to one of the player stars
    const playerStars = req.user.selectedPlayer.stars.map(star => star._id);
    const planet = await Planet.findOne({star: {$in: playerStars}, _id: planetId}).populate("pdus");
    if (!planet) {
        logger.error(`[App] user ${req.user.username} is not owner of the planet.`);
        return res.json({error: i18n.__("API.EMPIRE.PDU.NOTOWNER")});
    }
    // 2. verify that the player has sufficient resources to pay the build cost
    let fundsError = false;
    cfg.pdus.types.find(pdu => pdu.type === pduType).costs.forEach(slot => {
        const stockpile = req.user.selectedPlayer.resources[slot.resourceType].current;
        if (Math.floor(slot.amount * amount) > stockpile) fundsError = true;
    });
    if (fundsError) {
        logger.error(`[App] user ${req.user.username} has insufficient funds to install harvester.`);
        return res.json({error: i18n.__("API.EMPIRE.PDU.FUNDS")});
    }
    // 3. verify that the number of new PDUs does not go above maxPDUs
    // maxPDU is not yet implemented since I'm not sure if this should depend on techlevel, planet type or population.
    const planetMaxPdus = cfg.pdus.maxPerPlanet; // mockup, same as in client/game/Empire/Planets/Defense/Construction.vue
    const installedPdus = planet.pdus.length;
    if (installedPdus + amount > planetMaxPdus) {
        const msg = `no ${amount} PDU slots available on planet (max: ${planetMaxPdus}, installed: ${installedPdus}).`;
        logger.error(`[App] ${msg}`);
        return res.json({error: i18n.__("API.EMPIRE.PDU.SLOTS")});
    }

    // no errors => proceed.
    return next();
};

/*
 * do build PDUs =======================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.buildPdus = async (req, res) => {
    const pduType = strip(req.body.type);
    const planetId = strip(req.body.planet);
    const amount = strip(req.body.amount);
    const turns = cfg.pdus.types.find(pdu => pdu.type === pduType).buildDuration;

    // 1) prepare new PDUs
    let pdus = Array.from({length: amount}).map(() => {
        return new Pdu({
            planet: planetId,
            game: req.user.selectedPlayer.game._id,
            owner: req.user.selectedPlayer._id,
            pduType,
            turnsUntilComplete: turns
        });
    });

    // 2) Subtract build costs from player resources
    let set = {};
    cfg.pdus.types.find(pdu => pdu.type === pduType).costs.forEach(slot => {
        set["resources." + slot.resourceType + ".current"] =
            req.user.selectedPlayer.resources[slot.resourceType].current - Math.floor(slot.amount * amount);
    });
    logger.info("set " + JSON.stringify(set, null, 2));

    // 3) and write
    const pduPromise = Pdu.insertMany(pdus);
    const playerPromise = Player.findOneAndUpdate(
        {_id: req.user.selectedPlayer._id},
        {$set: set},
        {new: true, runValidators: true, context: "query"}
    );
    const [newPdus, updatedPlayer] = await Promise.all([pduPromise, playerPromise]);
    const pduIds = newPdus.map(pdu => pdu._id);
    if (!updatedPlayer) {
        logger.error(`[App] error saving build costs for PDUs.`);
    }
    if (!newPdus) {
        logger.error(`[App] error saving new PDU to db.`);
    }

    // 4) log success and send pdu IDs to client
    updatedPlayer &&
        newPdus &&
        logger.success(
            `[App] player ${chalk.red(req.user.selectedPlayer.ticker)} ${"@" +
                req.user.username} installed ${amount} ${chalk.yellow(pduType)} PDUs on Planet ${chalk.cyan(
                "#" + planetId
            )}: ${JSON.stringify(pduIds, null, 2)}`
        );

    // send new IDs to client
    return res.status(200).json({pduType, pduIds, turnsUntilComplete: turns});
};

/*
 * check if XHR POST set food consumption is valid =====================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.checkFoodConsumption = async (req, res, next) => {
    const planetId = strip(req.body.planet);
    const consumption = parseFloat(req.body.consumption);
    logger.info(
        `[App] Player ${chalk.red("[" + req.user.selectedPlayer.ticker + "]")} set food consumption ${JSON.stringify(
            req.body,
            null,
            2
        )}.`
    );
    // 1. check if the planet belongs to one of the player stars
    const playerStars = req.user.selectedPlayer.stars.map(star => star._id);
    const planet = await Planet.findOne({star: {$in: playerStars}, _id: planetId});
    if (!planet) {
        logger.error(`[App] user ${req.user.username} is not owner of the planet.`);
        return res.json({error: i18n.__("API.EMPIRE.FOOD.NOTOWNER")});
    }
    // 2. check if consumption is within bounds
    const bounds = cfg.planets.population.food.bounds;
    if (isNaN(consumption) || consumption < bounds[0] || consumption > bounds[1]) {
        logger.error(`[App] consumption of ${consumption} is NaN or out of bounds.`);
        return res.json({error: i18n.__("API.EMPIRE.FOOD.OUTOFBOUNDS", `${bounds[0]} - ${bounds[1]}`)});
    }

    // no errors => proceed.
    return next();
};

/*
 * do change food consumption ==========================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.setFoodConsumption = async (req, res) => {
    const planetId = strip(req.body.planet);
    const consumption = parseFloat(req.body.consumption);
    // update db
    const updatedPlanet = await Planet.findOneAndUpdate(
        {_id: planetId},
        {$set: {foodConsumptionPerPop: consumption}},
        {new: true, runValidators: true}
    );
    if (updatedPlanet) {
        logger.success(
            `[App] player ${chalk.red(req.user.selectedPlayer.ticker)} ${"@" +
                req.user.username} changed food consumption of planet #${chalk.cyan(planetId)} to ${chalk.yellow(
                consumption
            )}`
        );
        return res.status(200).json({foodConsumptionPerPop: updatedPlanet.foodConsumptionPerPop});
    }
};
