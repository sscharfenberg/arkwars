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
const turnHandlers = require("./turn");
require("../../models/Game");
const Game = mongoose.model("Game");
const cfg = require("../../config");
// server tick threshold for game turn processing.
// game turns that are due in (threshold) are processed
const TURNDUE_THRESHOLD = cfg.games.turns.dueThreshold;

const processServerTick = async () => {
    logger.info("processing server tick.");
    const activeGames = await Game.find({active: true}).populate("turns");
    logger.info(
        `found ${chalk.red(activeGames.length)} active games: ${chalk.cyan(
            "[" + activeGames.map(game => game.number) + "]"
        )}`
    );

    // filter active games and remove the ones that we do not need to process
    let gamesToProcess = activeGames.filter(game => {
        // a) games where turnDue is > now + threshold
        // we process turns 30s early and we could be 30s late -
        // adjustment so the turn calculation is not a full minute late
        if (moment().diff(game.turnDue) + TURNDUE_THRESHOLD < 0) {
            logger.info(
                `${chalk.cyan("g" + game.number)} is due @ ${chalk.cyan(
                    moment(game.turnDue).format("HH:mm:ss.SSSS")
                )} ${chalk.yellow(moment(game.turnDue).fromNow())}.`
            );
            return false;
        }
        // b) games that have processing = true
        if (game.processing) {
            logger.error(
                `${chalk.cyan("g" + game.number)} is still processing.`
            );
            return false;
        }
        // c) games where the next turn was already processed
        let processedTurn = game.turns.filter(turn => {
            return turn.slug === `g${game.number}t${game.turn + 1}`; // + 1 = next turn! slugs are unique.
        });
        // TODO: fix already processed turn (crashed node process during turn processing)
        if (processedTurn.length) {
            logger.error(
                `${chalk.cyan("g" + game.number)} ${chalk.yellow(
                    "t" + (game.turn + 1)
                )} already processed.`
            );
            return false;
        }

        // d) everything else will be processed.
        return true;
    });

    // nothing to process
    if (!gamesToProcess.length) {
        logger.debug("nothing to process.");
        return;
    }

    let processingGameNumbers = gamesToProcess.map(game => game.number);
    logger.success(
        `processing games: ${chalk.cyan("[ " + processingGameNumbers + " ]")}.`
    );
    gamesToProcess.forEach(async game => {
        logger.info(
            `processing ${chalk.red("g" + game.number)} ${chalk.yellow(
                "t" + (game.turn + 1)
            )} due @ ${chalk.cyan(
                moment(game.turnDue).format("HH:mm:ss.SSSS")
            )}`
        );
        try {
            await turnHandlers.processTurnData(game);
        } catch (e) {
            logger.error(e);
        }
    });
};

/*
 * `startup` - script that sets up the server ticks
 * @callee /server/cron.js - called via npm script and started as a seperate process to the backend.
 */
const startup = async () => {
    logger.info("starting cron server.");
    // every minute, check active games again since some might have been set to active.
    cron.scheduleJob("0 * * * * *", async function() {
        try {
            await processServerTick();
        } catch (e) {
            logger.error(e);
        }
    });
    logger.success("server ticks scheduled.");
    try {
        await processServerTick();
    } catch (e) {
        console.log(e);
    }
};

// export the public functions.
exports.startup = startup;

