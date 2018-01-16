/***********************************************************************************************************************
 *
 * turn handler
 *
 **********************************************************************************************************************/
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../handlers/logger/console");
require("../models/");
const Game = mongoose.model("Game");
//const Planet = mongoose.model("Planet");
const Player = mongoose.model("Player");
const Harvester = mongoose.model("Harvester");
const Turn = mongoose.model("Turn");
const cfg = require("../config");

/*
 * build process for harvesters
 * @param {object} game - Game model object from mongo
 * @returns {object} log
 */
const harvesterBuildProcess = async (game, log) => {
    const processedHarvesters = await Harvester.updateMany(
        {turnsUntilComplete: {$ne: 0}, game: game._id},
        {$inc: {turnsUntilComplete: -1}},
        {new: true, runValidators: true, context: "query"}
    );
    logger.info(`processed ${chalk.cyan(processedHarvesters.nModified)} harvesters in build.`);
    return {
        harvesterBuilding: processedHarvesters.nModified || 0,
        ...log
    };
};

/*
 * harvesters producing actual resorces.
 * @param {object} game - Game model object from mongo
 * @returns {object} log
 */
const playerHarvesterProduction = async (game, log) => {
    logger.info(`start processing harvester production.`);
    const players = await Player.find({game: game._id}).populate("harvesters");
    let changedPlayerResources = players.map(player => {
        return {
            player: player._id,
            resources: player.resources
        };
    });
    // loop all players from the game
    players.forEach(player => {
        // filter the harvesters by the ones that are actually harvesting
        player.harvesters.filter(harvester => harvester.isHarvesting).forEach(harvester => {
            let cost = cfg.harvesters.build.find(hT => hT.type === harvester.resourceType).baseProduction;
            // TODO: add tech level modification
            changedPlayerResources.find(cp => cp.player === player._id).resources[
                harvester.resourceType
            ].current += cost;
        });
    });
    changedPlayerResources = enforceStockPileMax(changedPlayerResources);
    // we have the new values, now updated db.
    let updatePromises = [];
    changedPlayerResources.forEach(slot => {
        updatePromises.push(
            Player.findOneAndUpdate(
                {_id: slot.player},
                {
                    $set: {
                        "resources.energy.current": slot.resources.energy.current,
                        "resources.food.current": slot.resources.food.current,
                        "resources.minerals.current": slot.resources.minerals.current,
                        "resources.research.current": slot.resources.research.current
                    }
                },
                {runValidators: true, context: "query"}
            )
        );
    });
    // all promises prepared, lets do them all at once
    logger.info(`executing ${chalk.cyan(updatePromises.length)} user update promises.`);
    await Promise.all(updatePromises);
    logger.info(`${chalk.yellow(updatePromises.length)} user update promises finished.`);
    return {
        harvesterProduction: changedPlayerResources,
        ...log
    };
};

/*
 * set array values to max if current > max
 * @param {Array} changedPlayerResources - Array with resource changes
 * @returns {Array} changedPlayerResources
 */
const enforceStockPileMax = changedPlayerResources => {
    return changedPlayerResources.map(player => {
        player.resources.energy.current =
            player.resources.energy.current > player.resources.energy.max
                ? player.resources.energy.max
                : player.resources.energy.current;
        player.resources.food.current =
            player.resources.food.current > player.resources.food.max
                ? player.resources.food.max
                : player.resources.food.current;
        player.resources.minerals.current =
            player.resources.minerals.current > player.resources.minerals.max
                ? player.resources.minerals.max
                : player.resources.minerals.current;
        player.resources.research.current =
            player.resources.research.current > player.resources.research.max
                ? player.resources.research.max
                : player.resources.research.current;
        return player;
    });
};

/*
 * turn processing order
 * @param {object} game - Game model object from mongo
 * @returns {object} log
 */
const turnProcessingOrder = async game => {
    logger.debug(`start turn processing for game ${chalk.red("g" + game.number)} turn ${chalk.yellow(game.turn)}`);
    let log = {};
    // harvesters in production ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    try {
        log = await harvesterBuildProcess(game, log);
    } catch (e) {
        logger.error(e);
    }
    // harvesters that are actually harvesting ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    try {
        log = await playerHarvesterProduction(game, log);
    } catch (e) {
        logger.error(e);
    }
    return log;
};

/*
 * process game data for a turn
 * fearlessly mutating game object
 * @param {object} game - Game model object from mongo
 */
const processGameTurn = async game => {
    game.turn++; // new turn!
    game.turnDue = moment()
        .add(game.turnDuration, "minutes")
        .toISOString();
    let turn = {
        game: game._id,
        number: game.turn,
        slug: `g${game.number}t${game.turn}`,
        dateProcessed: moment().toISOString()
    };
    logger.info(`processing ${chalk.red("g" + game.number)} game data for turn ${chalk.cyan(turn.number)}`);
    try {
        // PROCESS TURN
        const log = await turnProcessingOrder(game);
        turn.log = JSON.stringify(log);
        await new Turn(turn).save();
        logger.info(`turn processing finished. log: ${JSON.stringify(log)}`);
    } catch (err) {
        logger.error(err);
    }
    return game;
};

/*
 * process a turn
 * @param {object} game - Game model object from mongo
 */
const processTurnData = async game => {
    let startTime = moment(); // remember the starting time so we can calculate runtime.
    let updatedGame;
    logger.debug(`processing turn ${chalk.magenta(game.turn + 1)} for ${chalk.red("g" + game.number)}.`);

    // process game data
    try {
        updatedGame = await processGameTurn(game);
    } catch (err) {
        updatedGame = game;
        logger.error(err);
    }

    // after the game data has been processed, save to db
    await Game.findOneAndUpdate({_id: updatedGame._id}, updatedGame, {
        runValidators: true
    }).exec();

    logger.success(
        `turn ${chalk.cyan(updatedGame.turn)} for ${chalk.red(
            "g" + updatedGame.number
        )} has been processed in ${chalk.yellow(moment.duration(moment().diff(startTime)).milliseconds())}ms.`
    );
};

exports.processTurnData = processTurnData;
