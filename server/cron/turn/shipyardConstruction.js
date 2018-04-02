/***********************************************************************************************************************
 *
 * construct shipyards
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../../handlers/logger/console");
require("../../models/");
const Shipyard = mongoose.model("Shipyard");

/*
 * research tech levels
 * @param {object} game - Game model object from mongo
 * @param {object} log - the log existing before this.
 * @returns {object} log
 */
module.exports = async (game, log) => {
    const processedShipyards = await Shipyard.updateMany(
        {turnsUntilComplete: {$ne: 0}, game: game._id},
        {$inc: {turnsUntilComplete: -1}},
        {new: true, runValidators: true, context: "query"}
    );
    logger.debug(`processed construction of ${chalk.yellow(processedShipyards.nModified)} ${chalk.cyan("shipyards")}.`);
    return {
        ...log,
        shipyardConstruction: processedShipyards.nModified || 0
    };
};
