/***********************************************************************************************************************
 *
 * CRON FUNCTIONS
 *
 **********************************************************************************************************************/
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const cron = require("node-schedule"); // https://www.npmjs.com/package/node-schedule
const logger = require("../logger/console");
const { catchErrors } = require("../error");
const turnHandlers = require("../turn");
require("../../models/Game");
const Game = mongoose.model("Game");

/*
 * schedule game turn
 * @param {object} game - Game model object from mongo
 */
const scheduleGameTurn = game => {
    const dueDate = moment(game.turnDue).toDate();
    logger.info(
        `scheduling turn ${chalk.cyan(game.turn + 1)} for ${chalk.red(
            "g" + game.number
        )} @${chalk.yellow(moment(game.turnDue).format("DD.MM.YYYY HH:mm:ss.SSSS"))}`
    );
    cron.scheduleJob(dueDate, function() {
        logger.info(
            `scheduler triggering turn processing for ${chalk.red(
                "g" + game.number
            )}, turn ${game.turn + 1}`
        );
        catchErrors(turnHandlers.processTurnData(game));
    });
};

/*
 * confirm game integrity: check if game data is ok and update if not.
 * @param {object} game - Game model object from mongo
 */
const confirmGameIntegrity = async game => {
    let doUpdate = false;
    logger.info(
        `${chalk.red("g" + game.number)}, current turn ${chalk.cyan(
            game.turn
        )}. turn ${chalk.cyan(game.turn + 1)} due: ${chalk.yellow(
            moment(game.turnDue).format("DD.MM.YYYY HH:mm:ss.SSSS")
        )}, duration ${game.turnDuration} mins.`
    );
    // turn processing was interrupted. fuck.
    if (game.processing) {
        logger.error("game is still on 👹👹 processing 👹👹.");
        game.processing = false; // stuck processing the turn probably.
        game.turnDue = moment().add(game.turnDuration, "minutes");
        doUpdate = true;
    }
    // turn due is in the past. we seem to have been offline quite a while.
    if (moment().diff(game.turnDue) > 0) {
        logger.error(`turnDue was ${moment(game.turnDue).fromNow()}. 👹👹`);
        game.turnDue = moment().add(game.turnDuration, "minutes");
        doUpdate = true;
    }
    // write gamedata only if needed.
    if (doUpdate) {
        await Game.findOneAndUpdate({ _id: game._id }, game, {
            runValidators: true
        }).exec();
        logger.debug(`game data for g${game.number} updated.`);
    }
};

/*
 * `startup` - script that sets up the server ticks
 * @callee /server/start.js - called on server start / restart
 */
exports.startup = async () => {
    const activeGames = await Game.find({ active: true });
    moment.locale("de");
    logger.info(
        `found ${chalk.red(activeGames.length)} active games in the database.`
    );

    if (activeGames.length > 0) {
        activeGames.forEach(game => {
            catchErrors(confirmGameIntegrity(game));
            scheduleGameTurn(game);
        });
    } else {
        console.info("no active games in db.");
    }
};

// export the functions.
exports.confirmGameIntegrity = confirmGameIntegrity;
exports.scheduleGameTurn = scheduleGameTurn;
