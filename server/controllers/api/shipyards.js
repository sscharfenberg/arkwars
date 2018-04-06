/***********************************************************************************************************************
 *
 * apiResearchController
 *
 * @exports {ExpressController}
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const mongoose = require("mongoose"); // http://mongoosejs.com/
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
//const strip = require("mongo-sanitize"); // https://www.npmjs.com/package/mongo-sanitize
const apiShipyardsGameDataController = require("./gameData/shipyards");
//const Research = mongoose.model("Research");
//const Player = mongoose.model("Player");
const logger = require("../../handlers/logger/console");
//const cfg = require("../../config");

/*
 * get game data =======================================================================================================
 * we do not want to send full mongoose objects to the client,
 * (there might be parts that we don't want to tell the player)
 * so we massage the data a bit.
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.getGameData = async (req, res) => {
    const returnData = await apiShipyardsGameDataController.fetch(req.user.selectedPlayer);
    logger.info(
        `[App] User ${chalk.red("@" + req.user.username)} requested ${chalk.cyan(
            "shipyards"
        )} game data for ${chalk.yellow("g" + returnData.game.number)} ${chalk.cyan(
            "[" + returnData.player.ticker + "]"
        )} ${chalk.cyan(returnData.player.name)}`
    );
    return res.json(returnData);
};

