/***********************************************************************************************************************
 *
 * turn handler
 *
 **********************************************************************************************************************/
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../../handlers/logger/console");
const pduConstruction = require("./pduConstruction");
const storageUpgradeConstruction = require("./storageUpgradeConstruction");
const harvesterProduction = require("./harvesterProduction");
const popFoodConsumption = require("./foodConsumption");
const harvesterConstruction = require("./harvesterConstruction");
const techLevelResearch = require("./techLevelResearch");
const shipyardConstruction = require("./shipyardConstruction");
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
        logger.info(`${chalk.green("1")} starting ${chalk.magenta("pdu")} ${chalk.cyan("construction")}`);
        log = await pduConstruction(game, log);
    } catch (e) {
        logger.error(e);
    }

    /*******************************************************************************************************************
     * 2) StorageUpgrades
     ******************************************************************************************************************/
    try {
        logger.info(`${chalk.green("2")} starting ${chalk.magenta("storage upgrade")} ${chalk.cyan("construction")}`);
        log = await storageUpgradeConstruction(game, log);
    } catch (e) {
        logger.error(e);
    }

    /*******************************************************************************************************************
     * 3) harvester production
     ******************************************************************************************************************/
    try {
        logger.info(`${chalk.green("3")} starting ${chalk.magenta("harvester")} ${chalk.cyan("production")}`);
        log = await harvesterProduction(game, log);
    } catch (e) {
        logger.error(e);
    }

    /*******************************************************************************************************************
     * 4) food consumption and population growth
     ******************************************************************************************************************/
    try {
        logger.info(
            `${chalk.green("4")} starting ${chalk.magenta("food")} ${chalk.cyan("consumption")} and ${chalk.magenta(
                "population"
            )} ${chalk.cyan("growth")}`
        );
        log = await popFoodConsumption(game, log);
    } catch (e) {
        logger.error(e);
    }

    /*******************************************************************************************************************
     * 5) harvesters construction
     ******************************************************************************************************************/
    try {
        logger.info(`${chalk.green("5")} starting ${chalk.magenta("harvester")} ${chalk.cyan("construction")}`);
        log = await harvesterConstruction(game, log);
    } catch (e) {
        logger.error(e);
    }

    /*******************************************************************************************************************
     * 6) shipyard construction
     ******************************************************************************************************************/
    try {
        logger.info(`${chalk.green("6")} starting ${chalk.magenta("shipyard")} ${chalk.cyan("construction")}`);
        log = await shipyardConstruction(game, log);
    } catch (e) {
        logger.error(e);
    }

    /*******************************************************************************************************************
     * 7) research jobs
     ******************************************************************************************************************/
    try {
        logger.info(`${chalk.green("7")} starting ${chalk.magenta("tech level")} ${chalk.cyan("research")}`);
        log = await techLevelResearch(game, log);
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
    game = await Game.findOneAndUpdate({_id: game._id}, {$set: {processing: true}}, {new: true, runValidators: true});
    logger.debug(`processing turn ${chalk.red("g" + game.number)}${chalk.yellow("t" + (game.turn + 1))}.`);
    await game.save(); // save game with processing and OLD turn
    game.turn++; // new turn!

    // process game data
    try {
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
