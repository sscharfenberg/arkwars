/***********************************************************************************************************************
 *
 * apiController
 *
 * @exports {ExpressController} pulse
 *
 **********************************************************************************************************************/
const fs = require("fs"); // https://nodejs.org/api/fs.html
const path = require("path"); // https://nodejs.org/api/path.html
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const Game = mongoose.model("Game");
const Planet = mongoose.model("Planet");
const logger = require("../../handlers/logger/console");
const cfg = require("../../config");

/*
 * prepare an array of text strings from filesystem ====================================================================
 * this array is kept in memory and can be accessed fast by the api endpoint
 * TODO: fs.statSync.mtime does not always return the correct time -.-
 */
const allTexts = [];
const locales = cfg.app.locales.map(locale => locale.name);
// get filenames of existing area message files
const areaLanguageFileNames = fs
    .readdirSync(path.join(cfg.app.projectDir, "client", "lang", locales[0]))
    .filter(fileName => fileName !== "common.json");
// read client text files once and cache them
locales.forEach(locale => {
    const pathCommon = path.join(cfg.app.projectDir, "client", "lang", locale, "common.json");
    let commonTime = fs.statSync(pathCommon).mtime;
    let commonContents = JSON.parse(fs.readFileSync(pathCommon, "utf-8"));
    logger.info(`caching ${locale}/common.json from ${moment(commonTime).format("DD.MM.YYYY HH:mm:ss")}`);
    areaLanguageFileNames.forEach(areaFileName => {
        const pathArea = path.join(cfg.app.projectDir, "client", "lang", locale, areaFileName);
        let areaTime;
        let areaContents;
        try {
            areaContents = JSON.parse(fs.readFileSync(pathArea, "utf-8"));
            areaContents.common = commonContents; // add common.json translations
            areaTime = fs.statSync(pathArea).mtime;
        } catch (e) {
            logger.error(e);
        }
        logger.info(`caching ${locale}/${areaFileName} from ${moment(areaTime).format("DD.MM.YYYY HH:mm:ss")}`);
        areaContents.version = moment(areaTime).diff(commonTime) > 0 ? areaTime : commonTime;
        allTexts.push({
            slug: `txt-${locale}-${areaFileName.replace(".json", "")}`,
            data: areaContents
        });
    });
});
logger.debug(`[App] cached ${chalk.yellow(allTexts.length)} client text objects.`);

/*
 * get game data =======================================================================================================
 * we do not want to send full mongoose objects to the client,
 * (there might be parts that we don't want to tell the player)
 * so we massage the data a bit.
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.cspViolation = (req, res) => {
    logger.error(`[App] CSP violation recieved from ${req.ip} ${req.user ? req.user.id : ""}`);
    logger.info("report: " + JSON.stringify(req.body, null, 2));
    logger.info("headers: " + JSON.stringify(req.headers, null, 2));
    res.end();
};

/*
 * get game status =====================================================================================================
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
 * get text strings ====================================================================================================
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
        res.json({error: "could not get client text strings."});
    }
};
