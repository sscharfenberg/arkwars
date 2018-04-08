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
const apiEmpireGameDataController = require("./gameData/empire");
const Planet = mongoose.model("Planet");
const Player = mongoose.model("Player");
const Star = mongoose.model("Star");
const Harvester = mongoose.model("Harvester");
const Pdu = mongoose.model("Pdu");
const Shipyard = mongoose.model("Shipyard");
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

/*
 * check if XHR POST "construct new shipyard" request is ===============================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.verifyNewShipyard = async (req, res, next) => {
    req.body.planet = strip(req.body.planet);
    req.body.type = strip(req.body.type);

    logger.info(
        `[App] Player ${chalk.red("[" + req.user.selectedPlayer.ticker + "]")} requesting ${
            req.body.type
        } shipyard construction on planet #${req.body.planet}`
    );

    // 1) emsire that the type passed exists
    if (!cfg.shipyards.hullTypes.map(hullType => hullType.name).includes(req.body.type)) {
        logger.error(`[App] shipyard type ${req.body.type} does not exist.`);
        return res.json({error: i18n.__("API.EMPIRE.SHIPYARD.NEW.INVALIDTYPE")});
    }

    // 2) verify the planet belongs to one of the players stars
    const playerStars = req.user.selectedPlayer.stars.map(star => star._id);
    const dbPlanet = await Planet.findOne({_id: req.body.planet, star: {$in: playerStars}});
    if (!dbPlanet) {
        logger.error(`[App] planet does not belong to player.`);
        return res.json({error: i18n.__("API.EMPIRE.SHIPYARD.NEW.NOTOWNER")});
    }

    // 3) verify the planet does not already have a shipyard
    if (dbPlanet.shipyards && dbPlanet.shipyards.length > 0) {
        logger.error(`[App] planet already has a shipyard.`);
        return res.json({error: i18n.__("API.EMPIRE.SHIPYARD.NEW.EXISTINGSHIPYARD")});
    }

    // 4) verify the player has sufficient funds to install shipyard
    const costs = cfg.shipyards.hullTypes
        .find(hullType => hullType.name === req.body.type)
        .costs.build.filter(cost => cost.resourceType !== "turns");
    let fundsError = false;
    costs.forEach(slot => {
        const stockpile = req.user.selectedPlayer.resources[slot.resourceType].current;
        if (slot.amount > stockpile) fundsError = true;
    });
    if (fundsError) {
        logger.error(`[App] insufficient funds to construct shipyard.`);
        return res.json({error: i18n.__("API.EMPIRE.SHIPYARD.NEW.FUNDS")});
    }

    // 5) ensure the shipyard is installed on a planet with population
    if (dbPlanet.effectivePopulation < 1) {
        logger.error(`[App] planet population insufficient to support a shipyard.`);
        return res.json({error: i18n.__("API.EMPIRE.SHIPYARD.NEW.POPULATION")});
    }

    // no errors => proceed.
    return next();
};

/*
 * check if XHR POST "construct new shipyard" request is valid =========================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.doCreateNewShipyard = async (req, res) => {
    const turnsUntilComplete = cfg.shipyards.hullTypes
        .find(hullType => hullType.name === req.body.type)
        .costs.build.find(cost => cost.resourceType === "turns").amount;
    const allTypes = cfg.shipyards.hullTypes.map(hullType => hullType.name);
    const hullTypes = [];
    let cont = true;

    // prepare shipyard with types. we want the array to have all available types; so for a "medium" shipyard
    // we want ["small", "medium"]
    allTypes.forEach(type => {
        cont && hullTypes.push(type); // add type if we should continue
        if (type === req.body.type) cont = false; // do not continue if we have found our type
    });
    const shipyardPromise = new Shipyard({
        planet: req.body.planet,
        game: req.user.selectedPlayer.game._id,
        owner: req.user.selectedPlayer._id,
        hullTypes,
        turnsUntilComplete
    }).save();

    // prepare cost updates to the player
    const costs = cfg.shipyards.hullTypes
        .find(hullType => hullType.name === req.body.type)
        .costs.build.filter(cost => cost.resourceType !== "turns");
    let set = {};
    costs.forEach(resource => {
        set["resources." + resource.resourceType + ".current"] =
            req.user.selectedPlayer.resources[resource.resourceType].current - resource.amount;
    });
    const playerPromise = Player.findOneAndUpdate(
        {_id: req.user.selectedPlayer._id},
        {$set: set},
        {new: true, runValidators: true}
    );

    // do db updates
    const [newShipyard, updatedPlayer] = await Promise.all([shipyardPromise, playerPromise]);

    if (!newShipyard || !updatedPlayer) {
        logger.error(
            `[App] DB Error. Shipyard: ${JSON.stringify(newShipyard)}, Player: ${JSON.stringify(
                updatedPlayer
            )}, Set: ${JSON.stringify(set)}`
        );
        return res.json({error: "DB Error"});
    }

    // all done.
    logger.success(
        `[App] player ${chalk.red(req.user.selectedPlayer.ticker)} ${"@" + req.user.username} began constructing of a ${
            req.body.type
        } shipyard on Planet ${chalk.cyan("#" + req.body.planet)}`
    );
    return res.status(200).json({
        shipyard: {
            id: newShipyard._id,
            planet: newShipyard.planet,
            hullTypes: newShipyard.hullTypes,
            turnsUntilComplete: newShipyard.turnsUntilComplete,
            active: newShipyard.isActive
        }
    });
};

/*
 * check if XHR POST "upgrade shipyard" request is valid ===============================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.verifyUpgradeShipyard = async (req, res, next) => {
    req.body.id = strip(req.body.id);

    logger.info(
        `[App] Player ${chalk.red("[" + req.user.selectedPlayer.ticker + "]")} requesting shipyard upgrade.`
    );

    // 1) verify that the shipyard exists and is owned by the player
    const dbShipyard = await Shipyard.findOne({_id: req.body.id, owner: req.user.selectedPlayer._id});
    if (!dbShipyard) {
        logger.error(`[App] shipyard not found.`);
        return res.json({error: i18n.__("API.EMPIRE.SHIPYARD.UPGRADE.NOTFOUND")});
    }

    // 2) ensure the planet belongs to one of the players stars
    const playerStars = req.user.selectedPlayer.stars.map(star => star._id);
    const dbPlanet = await Planet.findOne({_id: dbShipyard.planet, star: {$in: playerStars}});
    if (!dbPlanet) {
        logger.error(`[App] planet does not belong to player.`);
        return res.json({error: i18n.__("API.EMPIRE.SHIPYARD.UPGRADE.NOTOWNER")});
    }

    // 3) verify that there is an upgrade available
    const allTypes = cfg.shipyards.hullTypes.map(type => type.name);
    req.body.newHullTypes = dbShipyard.hullTypes;
    if (dbShipyard.hullTypes.length >= allTypes.length) {
        logger.error(`[App] shipyard can not be upgraded any further.`);
        return res.json({error: i18n.__("API.EMPIRE.SHIPYARD.UPGRADE.NOUPGRADE")});
    }
    req.body.newHullTypes.push(allTypes[req.body.newHullTypes.length]);

    // 4) make sure the player has enough resources to pay for the upgrade
    const costs = cfg.shipyards.hullTypes
        .find(hullType => hullType.name === req.body.newHullTypes[req.body.newHullTypes.length - 1])
        .costs.build.filter(cost => cost.resourceType !== "turns");
    let fundsError = false;
    costs.forEach(slot => {
        const stockpile = req.user.selectedPlayer.resources[slot.resourceType].current;
        if (slot.amount > stockpile) fundsError = true;
    });
    if (fundsError) {
        logger.error(`[App] insufficient funds to upgrade shipyard.`);
        return res.json({error: i18n.__("API.EMPIRE.SHIPYARD.UPGRADE.FUNDS")});
    }

    // no errors => proceed.
    return next();
};

/*
 * execute "upgrade shipyard" request ==================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.doUpgradeShipyard = async (req, res) => {
    const turnsUntilComplete = cfg.shipyards.hullTypes[req.body.newHullTypes.length - 1].costs.upgrade.find(
        cost => cost.resourceType === "turns"
    ).amount;

    // prepare shipyard update
    const shipyardPromise = Shipyard.findOneAndUpdate(
        {_id: req.body.id},
        {$set: {turnsUntilComplete, hullTypes: req.body.newHullTypes}},
        {new: true, runValidators: true}
    );

    // prepare player update
    const costs = cfg.shipyards.hullTypes[req.body.newHullTypes.length - 1].costs.upgrade.filter(
        cost => cost.resourceType !== "turns"
    );
    let set = {};
    costs.forEach(resource => {
        set["resources." + resource.resourceType + ".current"] =
            req.user.selectedPlayer.resources[resource.resourceType].current - resource.amount;
    });
    const playerPromise = Player.findOneAndUpdate(
        {_id: req.user.selectedPlayer._id},
        {$set: set},
        {new: true, runValidators: true}
    );

    // execute db updates
    const [updatedShipyard, updatedPlayer] = await Promise.all([shipyardPromise, playerPromise]);
    if (!updatedShipyard || !updatedPlayer) {
        logger.error(
            `[App] DB Error. Shipyard: ${JSON.stringify(updatedShipyard)}, Player: ${JSON.stringify(
                updatedPlayer
            )}, Set: ${JSON.stringify(set)}`
        );
        return res.json({error: "DB Error"});
    }

    // all done.
    logger.success(
        `[App] player ${chalk.red(req.user.selectedPlayer.ticker)} ${"@" + req.user.username} began ${
            req.body.newHullTypes[req.body.newHullTypes.length - 1]
        } shipyard upgrade for #${req.body.id}`
    );
    return res.status(200).json({
        shipyard: {
            id: updatedShipyard._id,
            planet: updatedShipyard.planet,
            hullTypes: updatedShipyard.hullTypes,
            turnsUntilComplete: updatedShipyard.turnsUntilComplete,
            active: updatedShipyard.isActive
        }
    });
};
