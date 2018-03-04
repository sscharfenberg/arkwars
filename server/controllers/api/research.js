/***********************************************************************************************************************
 *
 * apiResearchController
 *
 * @exports {ExpressController}
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const mongoose = require("mongoose"); // http://mongoosejs.com/
const strip = require("mongo-sanitize"); // https://www.npmjs.com/package/mongo-sanitize
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const Planet = mongoose.model("Planet");
const Player = mongoose.model("Player");
const Star = mongoose.model("Star");
const Harvester = mongoose.model("Harvester");
const Pdu = mongoose.model("Pdu");
const logger = require("../../handlers/logger/console");
const cfg = require("../../config");

/*
 * get game data =======================================================================================================
 * we do not want to send full mongoose objects to the client,
 * (there might be parts that we don't want to tell the player)
 * so we massage the data a bit.
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.getGameData = async (req, res) => {
    const player = req.user.selectedPlayer;
    const game = player.game;
    const stars = player.stars.map(star => star.id);

    // prepare return data ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const returnData = {
        game: {
            // only selected game props
            number: game.number,
            active: game.active,
            dimensions: game.dimensions,
            turn: game.turn,
            turnDue: game.turnDue,
            turnDuration: game.turnDuration,
            processing: game.processing
        },
        player: {
            // again, only selected props
            name: player.name,
            ticker: player.ticker
        },
        resources: [
            // flatten resource data into an array for VueJS
            // TODO: find a more elegant way to do this.
            {
                type: "energy",
                current: player.resources.energy.current,
                max: player.resources.energy.max
            },
            {
                type: "food",
                current: player.resources.food.current,
                max: player.resources.food.max
            },
            {
                type: "minerals",
                current: player.resources.minerals.current,
                max: player.resources.minerals.max
            },
            {
                type: "research",
                current: player.resources.research.current,
                max: player.resources.research.max
            }
        ]
    };

    logger.info(
        `[App] User ${chalk.red("@" + req.user.username)} requested ${chalk.cyan(
            "research"
        )} game data for ${chalk.yellow("g" + returnData.game.number)} ${chalk.cyan(
            "[" + returnData.player.ticker + "]"
        )} ${chalk.cyan(returnData.player.name)}`
    );

    return res.json(returnData);
};
