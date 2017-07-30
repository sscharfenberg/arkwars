/***********************************************************************************************************************
 *
 * turn handler
 *
 **********************************************************************************************************************/
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../handlers/logger/console");
const { catchErrors } = require("./error"); // Error handling
const cronHandler = require("../handlers/cron");
require("../models/Game");
const Game = mongoose.model("Game");

/*
 * process game data for a turn
 * @param {object} game - Game model object from mongo
 */
const processGameTurn = async game => {
    logger.info(
        `processing ${chalk.red(
            "g" + game.number
        )} game data for turn ${chalk.cyan(game.turn)}`
    );
    // TODO: process game data for realz.
};

/*
 * process a turn
 * @param {object} game - Game model object from mongo
 */
const processTurnData = async game => {
    let startTime = moment(); // remember the starting time so we can calculate runtime.
    game.turn++; // new turn!
    logger.debug(
        `processing turn ${chalk.magenta(game.turn)} for ${chalk.red(
            "g" + game.number
        )}.`
    );

    // process game data
    catchErrors(processGameTurn(game, startTime));

    // after the game data has been processed, set new due data (full duration!)
    game.turnDue = moment().add(game.turnDuration, "minutes").toISOString();
    // and save to db
    await Game.findOneAndUpdate({ _id: game._id }, game, {
        runValidators: true
    }).exec();

    let duration = moment.duration(moment().diff(startTime)).milliseconds();
    logger.success(
        `turn ${chalk.cyan(game.turn)} for ${chalk.red(
            "g" + game.number
        )} has been processed in ${duration}ms.`
    );

    // schedule next turn
    cronHandler.scheduleGameTurn(game);
};

exports.processTurnData = processTurnData;
