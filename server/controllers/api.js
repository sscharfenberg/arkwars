/***********************************************************************************************************************
 *
 * apiController
 *
 * @exports {ExpressController} pulse
 *
 **********************************************************************************************************************/
const fs = require("fs"); // https://nodejs.org/api/fs.html
const path = require("path"); // https://nodejs.org/api/path.html
const {promisify} = require("util");
const readFileAsync = promisify(fs.readFile);
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const Game = mongoose.model("Game");
const logger = require("../handlers/logger/console");
const cfg = require("../config");

/*
 * get game status
 *
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 *
 * @respondswith:
 * {int} number - game number
 * {String.ISO8601} serverTime
 * {int} turn - current game turn
 * {int} turnDuration - in minutes
 * {String.ISO8601} nextProcess - time when the next turn is processed.
 */
exports.gameStatus = async (req, res, next) => {
    const gameNumber = req.params.game || 0;
    const now = moment();
    const game = await Game.findOne({number: gameNumber});

    if (game) {
        res.json({
            number: game.number,
            active: game.active,
            processing: game.processing,
            serverTime: now.toISOString(),
            turn: game.turn,
            turnDuration: game.turnDuration,
            turnDue: game.turnDue
        });
    } else {
        const err = new Error("Game not found.");
        err.status = 500;
        logger.error(`[Node] 500 Game not found: "${req.path}"`);
        next(err);
    }
};

/*
 * get text strings
 *
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.getTextStrings = async (req, res) => {
    logger.info(
        `[App] preparing ${req.params.locale} text strings for area ${
            req.params.area
        }`
    );
    // these two files need to exist
    const pathArea = path.join(
        cfg.app.projectDir,
        "client",
        "lang",
        req.params.locale,
        req.params.area + ".json"
    );
    const pathCommon = path.join(
        cfg.app.projectDir,
        "client",
        "lang",
        req.params.locale,
        "common.json"
    );
    const areaPromise = readFileAsync(pathArea, "utf-8");
    const commonPromise = readFileAsync(pathCommon, "utf-8");
    try {
        // set variables when promises are fulfilled
        let [areaMessages, commonMessages] = await Promise.all([
            areaPromise,
            commonPromise
        ]);
        // convert json strings to objects
        areaMessages = JSON.parse(areaMessages);
        commonMessages = JSON.parse(commonMessages);
        areaMessages.common = commonMessages;
        const areaTime = fs.statSync(pathArea).mtime;
        const commonTime = fs.statSync(pathCommon).mtime;
        areaMessages.version = moment(areaTime).diff(commonTime) > 0 ? areaTime : commonTime;
        res.json(areaMessages);
    } catch (e) {
        logger.error(e);
        res.json({error: "could not find all text files."});
    }
};
