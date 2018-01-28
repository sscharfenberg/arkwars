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
const pduConstruction = async (game, log) => {
    const processedPdus = await Pdu.updateMany(
        {turnsUntilComplete: {$ne: 0}, game: game._id},
        {$inc: {turnsUntilComplete: -1}},
        {new: true, runValidators: true, context: "query"}
    );
    logger.info(`processed ${chalk.cyan(processedPdus.nModified)} PDUs under construction.`);
    return {
        pduConstruction: processedPdus.nModified || 0,
        ...log
    };
};

module.exports = pduConstruction;
