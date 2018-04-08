/***********************************************************************************************************************
 *
 * PDU construction
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../../handlers/logger/console");
require("../../models/");
const Pdu = mongoose.model("Pdu");

/*
 * PDU construction
 * @param {object} game - Game model object from mongo
 * @param {object} log - the log existing before this.
 * @returns {object} log
 */
module.exports = async (game, log) => {
    const processedPdus = await Pdu.updateMany(
        {turnsUntilComplete: {$ne: 0}, game: game._id},
        {$inc: {turnsUntilComplete: -1}},
        {new: true, runValidators: true, context: "query"}
    );
    logger.debug(
        `${chalk.red("g" + game.number + "t" + game.turn)} processed construction of ${chalk.yellow(
            processedPdus.nModified
        )} ${chalk.cyan("PDUs")}.`
    );
    return {
        ...log,
        pduConstruction: processedPdus.nModified || 0
    };
};
