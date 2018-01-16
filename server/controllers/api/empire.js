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
const Planet = mongoose.model("Planet");
const Player = mongoose.model("Player");
const Star = mongoose.model("Star");
const Harvester = mongoose.model("Harvester");
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
    const stars = player.stars.map(star => star.id);
    // get unsorted array of all planets that belong to the player's stars
    let planets = await Planet.find({star: {$in: stars}}).populate("harvesters");

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
            // props from player
            {type: "energy", current: player.resources.energy.current, max: player.resources.energy.max},
            {type: "food", current: player.resources.food.current, max: player.resources.food.max},
            {type: "minerals", current: player.resources.minerals.current, max: player.resources.minerals.max},
            {type: "research", current: player.resources.research.current, max: player.resources.research.max}
        ],
        // avoid specific properties on the star and add an array of planetids
        stars: player.stars.map(star => {
            return {
                id: star._id,
                name: star.name,
                spectral: star.spectral,
                coordX: star.coordX,
                coordY: star.coordY,
                planets: planets.filter(planet => `${planet.star}` === `${star._id}`).map(planet => planet.id)
            };
        }),
        harvesters: [],
        planets: []
    };

    // add mapped planets
    returnData.planets = planets.map(planet => {
        return {
            id: planet._id,
            type: planet.type,
            orbitalIndex: planet.orbitalIndex,
            resourceSlots: planet.resources.map(slot => {
                // harvester data into returnData.harvesters array
                returnData.harvesters = planet.harvesters
                    // only harvesters with the correct type
                    .filter(harvester => harvester.resourceType === slot.resourceType)
                    // map to new object with specific order
                    .map(harvester => {
                        return {
                            id: harvester._id,
                            resourceType: harvester.resourceType,
                            turnsUntilComplete: harvester.turnsUntilComplete,
                            isHarvesting: harvester.isHarvesting
                        };
                    })
                    // and add to returnData
                    .concat(returnData.harvesters);
                return {
                    resourceType: slot.resourceType,
                    slots: slot.slots,
                    id: slot._id,
                    // harvester ids are added into array here
                    harvesters: planet.harvesters
                        .filter(harvester => harvester.resourceType === slot.resourceType)
                        .map(harvester => harvester._id)
                };
            })
        };
    });

    logger.info(
        `[App] User ${chalk.red("@" + req.user.username)} requested game data for ${chalk.yellow(
            "g" + returnData.game.number
        )} ${chalk.cyan("[" + returnData.player.ticker + "]")} ${chalk.cyan(returnData.player.name)}`
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
        return res.status(403).json({message: "you are not allowed to edit this star."});
    }
    if (req.body.name.length < cfg.stars.name.bounds[0] || req.body.name.length > cfg.stars.name.bounds[1]) {
        logger.error(`[App] star name ${req.body.name} length is out of bounds.`);
        return res.status(406).json({message: "length of star name out of bounds."});
    }
    const updatedStar = await Star.findOneAndUpdate(
        {_id: strip(req.body.id)},
        {$set: {name: strip(req.body.name)}},
        {new: true, runValidators: true, context: "query"}
    );
    if (updatedStar) {
        logger.success(
            `[App] name of star ${chalk.yellow(req.body.id)} was changed to ${chalk.cyan(updatedStar.name)}.`
        );
        return res.status(200).json({data: {name: updatedStar.name}});
    } else {
        logger.success(`[App] error saving name.`);
        return res.status(500).json({message: "error while saving to database."});
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
        return res.status(403).json({error: "you are not allowed to install a harvester on this planet."});
    }
    // 2. verify that the player has sufficient resources to pay the build cost
    const buildCosts = cfg.harvesters.build.filter(harvester => harvester.type === harvesterType).shift().costs;
    buildCosts.forEach(slot => {
        const stockpile = req.user.selectedPlayer.resources[slot.resourceType].current;
        if (slot.amount > stockpile) {
            logger.error(`[App] user ${req.user.username} has insufficient funds to install harvester.`);
            return res.status(402).json({error: "insufficient funds to install harvester."});
        }
    });
    // 3. verify that the planet has slots available for the resource type
    const numSlots = planet.resources.find(slot => slot.resourceType === harvesterType).slots;
    const installed = planet.harvesters.filter(harvester => harvester.resourceType === harvesterType).length;
    if (installed >= numSlots) {
        const msg = `no ${harvesterType} slots available on planet (slots: ${numSlots}, installed: ${installed}).`;
        logger.error(`[App] ${msg}`);
        return res.status(403).json({error: msg});
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
    const turns = cfg.harvesters.build.filter(harvester => harvester.type === harvesterType).shift().duration;
    // create new harvester
    const harvester = new Harvester({
        planet: planetid,
        game: req.user.selectedPlayer.game._id,
        owner: req.user.selectedPlayer._id,
        resourceType: harvesterType,
        turnsUntilComplete: turns
    });
    // get the new values for resources
    const buildCosts = cfg.harvesters.build.find(harvester => harvester.type === harvesterType).costs;
    let set = {};
    buildCosts.forEach(resource => {
        set["resources." + resource.resourceType + ".current"] =
            req.user.selectedPlayer.resources[resource.resourceType].current - resource.amount;
    });
    const harvesterPromise = harvester.save();
    const playerPromise = Player.findOneAndUpdate(
        {_id: req.user.selectedPlayer._id},
        {$set: set},
        {new: true, runValidators: true, context: "query"}
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
