/***********************************************************************************************************************
 *
 * turn handler
 *
 **********************************************************************************************************************/
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../../handlers/logger/console");
const popFoodConsumption = require("./foodConsumption");
const harvesterProduction = require("./harvesterProduction");
const pduConstruction = require("./pduConstruction");
const harvesterConstruction = require("./harvesterConstruction");
const logTurn = require("../../handlers/logger/turn");
require("../../models/");
const Game = mongoose.model("Game");
const Turn = mongoose.model("Turn");

/*
 * turn processing order
 * @param {object} game - Game model object from mongo
 * @returns {object} log
 */
const turnProcessingOrder = async game => {
    logger.debug(`start turn processing for game ${chalk.red("g" + game.number)} turn ${chalk.yellow(game.turn)}`);
    let log = {};

    /*******************************************************************************************************************
     * 1) PDU construction
     ******************************************************************************************************************/
    try {
        log = await pduConstruction(game, log);
    } catch (e) {
        logger.error(e);
    }

    /*******************************************************************************************************************
     * 2) harvester production
     ******************************************************************************************************************/
    try {
        log = await harvesterProduction(game, log);
    } catch (e) {
        logger.error(e);
    }

    /*******************************************************************************************************************
     * 3) food consumption and population growth
     ******************************************************************************************************************/
    try {
        log = await popFoodConsumption(game, log);
    } catch (e) {
        logger.error(e);
    }

    /*******************************************************************************************************************
     * 4) harvesters construction
     ******************************************************************************************************************/
    try {
        log = await harvesterConstruction(game, log);
    } catch (e) {
        logger.error(e);
    }

    return log;
};

/*
 * process game data for a turn
 * fearlessly mutating game object
 * @param {Object} game - Game model object from mongo
 * @returns {Object} game - new turn, turnDue
 */
const processGameTurn = async game => {
    game.turn++; // new turn!
    game.turnDue = moment()
        .add(game.turnDuration, "minutes")
        .toISOString();
    let turn = new Turn({
        game: game._id,
        number: game.turn,
        slug: `g${game.number}t${game.turn}`,
        dateProcessed: moment().toISOString()
    });
    logger.info(`processing ${chalk.red("g" + game.number)} game data for turn ${chalk.cyan(turn.number)}`);
    try {
        // PROCESS TURN
        const log = await turnProcessingOrder(game);
        await turn.save();
        logTurn(game, log);
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
        // TODO: set processing to true
        updatedGame = await processGameTurn(game);
    } catch (err) {
        updatedGame = game;
        logger.error(err);
    }

    // after the game data has been processed, save to db
    await Game.findOneAndUpdate({_id: updatedGame._id}, updatedGame, {
        runValidators: true
    });

    logger.success(
        `turn ${chalk.cyan(updatedGame.turn)} for ${chalk.red(
            "g" + updatedGame.number
        )} has been processed in ${chalk.yellow(moment.duration(moment().diff(startTime)).milliseconds())}ms.`
    );
};

exports.processTurnData = processTurnData;
