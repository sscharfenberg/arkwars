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
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const strip = require("mongo-sanitize"); // https://www.npmjs.com/package/mongo-sanitize
const Game = mongoose.model("Game");
const Player = mongoose.model("Player");
const StorageUpgrade = mongoose.model("StorageUpgrade");
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
    const gameNumber = strip(req.params.game) || 0;
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
    const textObj = allTexts.find(obj => obj.slug === slug);
    if (textObj.data) {
        res.json(textObj.data);
    } else {
        res.json({error: "could not get client text strings."});
    }
};

/*
 * check if game is processing =========================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.gameProcessing = async (req, res, next) => {
    const game = await Game.findOne({_id: req.user.selectedPlayer.game._id});
    if (!game) {
        logger.error(`[App] game g${req.user.selectedPlayer.game.number} not found.`);
        return res.status(500).end();
    }
    if (game.processing) {
        logger.debug(`[App] game g${req.user.selectedPlayer.game.number} is still processing.`);
        return res.json({error: i18n.__("API.GAME.PROCESSING")});
    }
    return next();
};

/*
 * verify "request storage upgrade" request is valid ===================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.verifyStorageUpgrade = async (req, res, next) => {
    req.body.resRules = cfg.player.resourceTypes.find(res => res.type === req.params.area).storageLevels;
    logger.info(
        `[App] ${chalk.cyan("@" + req.user.username)} Player ${chalk.red(
            "[" + req.user.selectedPlayer.ticker + "]"
        )} requested storage upgrade for ${chalk.yellow(req.params.area)}`
    );

    // 1) verify next level is within bounds
    const nextLevel = req.user.selectedPlayer.resources[req.params.area].storageLevel + 1;
    if (
        !nextLevel ||
        nextLevel < req.body.resRules[0].lvl ||
        nextLevel > req.body.resRules[req.body.resRules.length - 1].lvl
    ) {
        logger.error(`[App] nextLevel ${chalk.red(nextLevel)} is out of bounds.`);
        return res.json({
            error: i18n.__(
                "API.GAME.STORAGEUPGRADE.OUTOFBOUNDS",
                `${req.body.resRules[0].lvl} - ${req.body.resRules[req.body.resRules.length - 1].lvl}`
            )
        });
    }

    // 2) verify player has sufficient funds to pay for the upgrade
    const costs = req.body.resRules
        .find(res => res.lvl === nextLevel)
        .costs // find correct object with the costs
        .filter(res => res.resourceType !== "turns"); // ignore "turns" since it is not a cost that can be paid
    let insufficientFunds = false;
    costs.forEach(slot => {
        const stockpile = req.user.selectedPlayer.resources[slot.resourceType].current;
        if (slot.amount > stockpile) insufficientFunds = true;
    });
    if (insufficientFunds) {
        logger.error(`[App] insufficient funds to upgrade storage.`);
        return res.json({error: i18n.__("API.GAME.STORAGEUPGRADE.FUNDS")});
    }

    // no errors -> proceed.
    req.body.nextLevel = nextLevel;
    return next();
};

/*
 * update database for new storage upgrade =============================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.doStorageUpgrade = async (req, res) => {

    // prepare storage upgrade for db
    const installingStorageUpgrade = new StorageUpgrade({
        game: req.user.selectedPlayer.game._id,
        player: req.user.selectedPlayer._id,
        area: req.params.area,
        newLevel: req.body.nextLevel,
        turnsUntilComplete: req.body.resRules
            .find(res => res.lvl === req.body.nextLevel)
            .costs.find(cost => cost.resourceType === "turns").amount
    });
    const storageUpgradePromise = installingStorageUpgrade.save();

    // prepare player update to pay for upgrade
    const costs = req.body.resRules
        .find(res => res.lvl === req.body.nextLevel)
        .costs.filter(cost => cost.resourceType !== "turns");
    let dbSet = {};
    costs.forEach(slot => {
        dbSet["resources." + slot.resourceType + ".current"] =
            req.user.selectedPlayer.resources[slot.resourceType].current - Math.floor(slot.amount);
    });
    logger.info("[App] setting resources to " + JSON.stringify(dbSet, null, 2));
    const playerPromise = Player.findOneAndUpdate(
        {_id: req.user.selectedPlayer._id},
        {$set: dbSet},
        {new: true, runValidators: true, context: "query"}
    );

    // execute DB updates
    const [storageUpgrade, updatedPlayer] = await Promise.all([storageUpgradePromise, playerPromise]);

    if (storageUpgrade && updatedPlayer) {
        logger.success(
            `[App] Player ${chalk.red(
                "[" + req.user.selectedPlayer.ticker + "]"
            )} started building storage upgrade ${chalk.yellow(storageUpgrade.area + "+" + storageUpgrade.newLevel)}.`
        );
        return res.json({storageUpgrade});
    }
    return res.json({error: "DB Error"});
};
