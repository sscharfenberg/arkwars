/***********************************************************************************************************************
 *
 * TURN LOGGER
 *
 *
 * @type {Node.js}
 *
 **********************************************************************************************************************/
const fs = require("fs-extra"); // https://nodejs.org/api/fs.html
const path = require("path"); // https://nodejs.org/api/path.html
const moment = require("moment"); // https://momentjs.com/
const logger = require("./console");
const cfg = require("../../config");


/*
 * @param {Object} game - Game model object from mongo
 * @param {object} log - the log existing before this.
 */
module.exports = (game, log) => {
    let logFileName = path.join(
        cfg.app.projectDir,
        "server",
        "logs",
        "turns",
        `g${game.number}t${game.turn}.log`
    );
    log = {
        gameId: game._id,
        gameNumber: game.number,
        turn: game.turn,
        dateProcessed: moment().format("dddd, DD.MM.YYYY HH:mm:ss.SSSS"),
        ...log
    };
    const logString = JSON.stringify(log, null, 2);
    fs.appendFile(logFileName, logString, "utf8", err => {
        if (err) {
            logger.error(err);
            throw err;
        }
    });
};
