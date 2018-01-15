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
const Harvester = mongoose.model("Harvester");
const Turn = mongoose.model("Turn");

/*
 * build process for harvesters
 * @param {object} game - Game model object from mongo
 */
const harvesterBuildProcess = async game => {
    try {
        const processedHarvesters = await Harvester.updateMany(
            {turnsUntilComplete:{$ne: 0}, game: game._id},
            {$inc: {turnsUntilComplete: -1}},
            {new: true, runValidators: true, context: "query"}
        );
        logger.info(`processed ${chalk.red(processedHarvesters.nModified)} harvesters in build.`);
        return processedHarvesters.nModified || 0;
    } catch(e) {
        logger.error(e);
        return 0;
    }
};

/*
 * turn processing order
 * @param {object} game - Game model object from mongo
 */
const turnProcessingOrder = async game => {
    logger.debug(`start turn processing for game ${chalk.red("g" + game.number)} turn ${chalk.yellow(game.turn)}`);
    try {
        const processedHarvestersBuilding = await harvesterBuildProcess(game);
    } catch(e) {
        logger.error(e);
    }
    return game;
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
    logger.info(
        `processing ${chalk.red("g" + game.number)} game data for turn ${chalk.cyan(turn.number)}`
    );

    // TODO: process game data for realz.
    try {
        game = await turnProcessingOrder(game);
    } catch(e) {
        logger.error(e);
    }

    // MOCKUP!!!
    turn.log = JSON.stringify({
        fleetsmoved: [4, 6],
        starsprocessed: [14, 58]
    });

    try {
        await new Turn(turn).save();
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
    logger.debug(
        `processing turn ${chalk.magenta(game.turn + 1)} for ${chalk.red(
            "g" + (game.number)
        )}.`
    );

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
        )} has been processed in ${chalk.yellow(
            moment.duration(moment().diff(startTime)).milliseconds()
        )}ms.`
    );
};

exports.processTurnData = processTurnData;
