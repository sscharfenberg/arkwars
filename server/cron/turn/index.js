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
    logger.debug(`beginning turn steps for ${chalk.red("g" + game.number)}${chalk.yellow("t" + game.turn)}`);
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

    logger.debug(`finished turn steps for ${chalk.red("g" + game.number)}${chalk.yellow("t" + game.turn)}`);
    return log;
};

/*
 * process game data for a turn
 * fearlessly mutating game object
 * @param {Object} game - Game model object from mongo
 * @returns {Object} game - new turn, turnDue
 */
const processTurnData = async game => {
    let turn = new Turn({
        game: game._id,
        number: game.turn,
        slug: `g${game.number}t${game.turn}`,
        dateProcessed: moment().toISOString()
    });
    logger.info(`processing turn data for ${chalk.red("g" + game.number)}${chalk.yellow("t" + turn.number)}`);
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
const processGameTurn = async game => {
    let startTime = moment(); // remember the starting time so we can calculate runtime.
    game = await Game.findOneAndUpdate(
        {_id: game._id},
        {$set: {processing: true}},
        {new: true, runValidators: true}
    );
    logger.debug(`processing turn ${chalk.red("g" + game.number)}${chalk.yellow("t" + (game.turn + 1))}.`);
    game.turn++;

    // process game data
    try {
        // TODO: set processing to true
        game = await processTurnData(game);
    } catch (err) {
        logger.error(err);
    }

    // after the game data has been processed, save to db
    game = await Game.findOneAndUpdate(
        {_id: game._id},
        {
            $set: {
                turn: game.turn,
                processing: false,
                turnDue: moment()
                    .add(game.turnDuration, "minutes")
                    .toISOString()
            }
        },
        {new: true, runValidators: true}
    );
    logger.success(
        `turn ${chalk.red("g" + game.number)}${chalk.yellow("t" + game.turn)} has been processed in ${chalk.yellow(
            moment.duration(moment().diff(startTime)).milliseconds()
        )}ms.`
    );
};

exports.processGameTurn = processGameTurn;
