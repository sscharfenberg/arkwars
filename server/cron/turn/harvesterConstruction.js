/***********************************************************************************************************************
 *
 * harvester construction
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../../handlers/logger/console");
require("../../models/");
const Harvester = mongoose.model("Harvester");

/*
 * build process for harvesters
 * @param {object} game - Game model object from mongo
 * @param {object} log - the log existing before this.
 * @returns {object} log
 */
const harvesterBuildProcess = async (game, log) => {
    const processedHarvesters = await Harvester.updateMany(
        {turnsUntilComplete: {$ne: 0}, game: game._id},
        {$inc: {turnsUntilComplete: -1}},
        {new: true, runValidators: true, context: "query"}
    );
    logger.info(`processed ${chalk.cyan(processedHarvesters.nModified)} harvesters under construction.`);
    return {
        harvesterConstruction: processedHarvesters.nModified || 0,
        ...log
    };
};

module.exports = harvesterBuildProcess;
