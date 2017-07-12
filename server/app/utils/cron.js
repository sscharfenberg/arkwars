/***********************************************************************************************************************
 *
 * CRON FUNCTIONS
 *
 **********************************************************************************************************************/
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../handlers/logger/console");
const errorHandlers = require("../handlers/error"); // Error handling
require("../models/Game");
const Game = mongoose.model("Game");

const updateGame = game => {};

/*
 * `startup` - script that sets up the server ticks
 * @callee /server/start.js - called on server start / restart
 */
exports.startup = async () => {
    const games = await Game.find({ active: true });
    moment.locale("de");
    logger.info(
        `found ${chalk.red(games.length)} active games in the database.`
    );

    // this is incredibly verbose. it is also really important.
    if (games.length > 0) {

        games.forEach(errorHandlers.catchErrors(async game => {
            const timeDifference = moment().diff(game.turnDue);
            let doUpdate = false;
            logger.info(
                `${chalk.cyan("g" + game.number)} => turn due: ${moment(
                    game.turnDue
                ).format("LLLL")}, duration ${game.turnDuration} mins.`
            );
            // turn processing was interrupted. fuck.
            if (game.processing) {
                logger.error("game is still on 👹👹 processing 👹👹.");
                game.processing = false;
                game.turn++; // a half processed turn sucks. skip it for now. TODO: rollback?
                doUpdate = true;
            }
            // turn due is in the past. we seem to have been offline quite a while.
            if (timeDifference > 0) {
                logger.error(
                    `turnDue was ${moment(game.turnDue).fromNow()}. 👹👹`
                );
                game.turnDue = moment().add(game.turnDuration, "minutes");
                doUpdate = true;
            }
            // write gamedata only if needed.
            if (doUpdate) {
                await Game.findOneAndUpdate({ _id: game._id }, game, {
                    runValidators: true
                }).exec();
                logger.success(`game data for g${game.number} updated.`);
            }

            logger.debug("TODO: schedule turn processing");

        }));

    } else {
        console.info("no active games in db.");
    }

};
