/***********************************************************************************************************************
 *
 * CRON GAME FUNCTIONS
 *
 **********************************************************************************************************************/
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../../handlers/logger/console");
//const turnHandlers = require("../turn");
const {playerSetup} = require("./setup");
require("../../models/");
const Game = mongoose.model("Game");
//const cfg = require("../config");

/*
 * start a specific game
 */
const start = async game => {
    let updatedGame = game;
    logger.debug(
        `starting ${chalk.red("g" + game.number)} startDate @ ${chalk.yellow(
            moment(game.startDate).format("LLLL")
        )} ${chalk.cyan(moment(game.startDate).fromNow())}`
    );
    updatedGame.active = true;
    updatedGame.processing = true;
    updatedGame.canEnlist = false;
    updatedGame.turn = 0;
    // set game meta data, including "processing"
    try {
        // after the game data has been processed, save to db
        await Game.findOneAndUpdate({_id: updatedGame._id}, updatedGame, {
            runValidators: true
        });
        logger.debug(`set game ${chalk.red(updatedGame.number)} to processing.`);
    } catch (e) {
        logger.error(e);
        logger.error(JSON.stringify(updatedGame, null, 2));
    }
    // setup initial starting stuff for players
    try {
        await playerSetup(updatedGame);
    } catch (e) {
        logger.error(e);
        logger.error(JSON.stringify(updatedGame, null, 2));
    }
    // set processing = false;
    try {
        const finalUpdate = await Game.findOneAndUpdate(
            {_id: updatedGame._id},
            {$set: {processing: false}},
            {new: true, runValidators: true}
        );
        logger.success(`game ${chalk.red(updatedGame.number)} started: ${chalk.yellow(JSON.stringify(finalUpdate, null, 2))}`);
    } catch (e) {
        logger.error(e);
        logger.error(JSON.stringify(updatedGame, null, 2));
    }
};

module.exports = {start};
