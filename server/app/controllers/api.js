/***********************************************************************************************************************
 *
 * apiController
 *
 * @exports {ExpressController} pulse
 *
 **********************************************************************************************************************/
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const Game = mongoose.model("Game");
const logger = require("../handlers/logger/console");

/*
 * `pulse` - server returns generic game-data
 * @returns:
 * {int} number - game number
 * {String.ISO8601} serverTime
 * {int} turn - current game turn
 * {int} turnDuration - in minutes
 * {String.ISO8601} nextProcess - time when the next turn is processed.
 */
exports.gameStatus = async (req, res, next) => {
    const gameNumber = req.params.game || 0;
    const now = moment();
    const game = await Game.findOne({ number: gameNumber });

    if (game) {
        res.json({
            number: game.number
            , active: game.active
            , processing: game.processing
            , serverTime: now.toISOString()
            , turn: game.turn
            , turnDuration: game.turnDuration
            , turnDue: game.turnDue
        });
    } else {
        const err = new Error("Game not found.");
        err.status = 500;
        logger.error(`[Node] 500 Game not found: "${req.path}"`);
        next(err);
    }

};
