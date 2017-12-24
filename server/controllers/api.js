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

const areas = ["empire"];
const locales = cfg.app.locales.map(locale => locale.name);
// require all client language files. this is so node can cache the file contents
const allTexts = [];

// read client text files once and cache them
areas.forEach(area => {
    locales.forEach(locale => {
        const pathArea = path.join(
            cfg.app.projectDir,
            "client",
            "lang",
            locale,
            area + ".json"
        );
        const pathCommon = path.join(
            cfg.app.projectDir,
            "client",
            "lang",
            locale,
            "common.json"
        );
        let areaTime, commonTime;
        let areaContents,
            commonContents = {};
        try {
            areaContents = JSON.parse(fs.readFileSync(pathArea, "utf-8"));
            areaTime = fs.statSync(pathArea).mtime;
        } catch (e) {
            logger.error(e);
        }
        try {
            commonContents = JSON.parse(fs.readFileSync(pathCommon, "utf-8"));
            areaContents.common = commonContents;
            commonTime = fs.statSync(pathCommon).mtime;
        } catch (e) {
            logger.error(e);
        }
        areaContents.version =
            moment(areaTime).diff(commonTime) > 0 ? areaTime : commonTime;
        allTexts.push({
            slug: `txt-${locale}-${area}`,
            data: areaContents
        });
    });
});
logger.info(`[App] cached ${allTexts.length} client text objects.`);

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
    const slug = `txt-${req.params.locale}-${req.params.area}`;
    logger.info(`[App] delivering client text strings for slug ${slug}`);
    const textObj = allTexts.filter(obj => obj.slug === slug)[0];
    if (textObj.data) {
        res.json(textObj.data);
    } else {
        res.json({"error":"could not get client text strings."});
    }
};
