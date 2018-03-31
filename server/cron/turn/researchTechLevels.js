/***********************************************************************************************************************
 *
 * research tech levels
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const calculate = require("../../../shared/calculations");
const logger = require("../../handlers/logger/console");
require("../../models/");
const Player = mongoose.model("Player");
const Planet = mongoose.model("Planet");
const Research = mongoose.model("Research");
const BULK_WRITES = require("../../config/cron").bulkWrites;

/*
 * research tech levels
 * @param {object} game - Game model object from mongo
 * @param {object} log - the log existing before this.
 * @returns {object} log
 */
module.exports = async (game, log) => {
    const playerPromise = Player.find({game: game._id}).populate("researches");
    const planetPromise = Planet.find({game: game._id, population: {$gt: 0}});
    const [players, planets] = await Promise.all([playerPromise, planetPromise]);
    const researchingPlayers = players.filter(player => player.researches.length > 0);
    let playerBulkUpdates = [];
    let playerWriteCounter = 0;
    let playerBatches = 0;
    let researchBulkUpdates = [];
    let researchWriteCounter = 0;
    let researchBatches = 0;
    let newLog = {
        insufficientFunds: [],
        newTechLevels: [],
        playerResearchProgress: [],
        playerWrites: {matched: 0, modified: 0},
        researchWrites: {matched: 0, modified: 0}
    };

    researchingPlayers.forEach(async player => {
        const playerStars = player.stars.map(star => `${star._id}`);
        // calculate total effective population, we need it for effective research
        const totalPopulation = planets
            .filter(planet => playerStars.includes(`${planet.star}`))
            .map(colony => colony.effectivePopulation)
            .reduce((acc, val) => acc + val);
        const effectiveResearch = calculate.effectiveResearch(totalPopulation, player.researchPriority);
        // find active job. we sort in case something went wrong and use the first (topmost) research
        const researches = player.researches.sort((a, b) => {
            return a.order - b.order;
        });
        const activeResearchJob = researches[0];
        // subtract research work from "remaining"
        const remainingAfterResearch = activeResearchJob.remaining - effectiveResearch;
        // does the player have enough resources to pay for the research?
        const resToPay = Math.ceil(totalPopulation * player.researchPriority);
        const playerRes = player.resources.research.current;
        const playerNewResource = resToPay > playerRes ? playerRes : playerRes - resToPay;

        // player can pay for the research =============================================================================
        if (playerRes >= resToPay) {
            // research is finished ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            if (remainingAfterResearch <= 0) {
                // add "delete finished research" to bulk queue
                researchBulkUpdates.push({
                    deleteOne: {
                        filter: {_id: activeResearchJob._id}
                    }
                });
                researchWriteCounter++;

                // update order for any remaining researches
                let remainingResearches = researches.slice(1); // first has already been handled above
                let counter = 0; // this sets top research to 0
                remainingResearches.forEach(res => {
                    researchBulkUpdates.push({
                        updateOne: {
                            filter: {_id: res._id},
                            update: {$set: {order: counter}}
                        }
                    });
                    researchWriteCounter++;
                    counter++;
                });

                // prepare player update
                let set = {};
                set["tech." + activeResearchJob.area] = activeResearchJob.newLevel;
                set["resources.research.current"] = playerNewResource;
                playerBulkUpdates.push({
                    updateOne: {
                        filter: {_id: player._id},
                        update: {$set: set}
                    }
                });
                playerWriteCounter++;
                // log the new tech level
                newLog.newTechLevels.push({
                    player: player._id,
                    area: activeResearchJob.area,
                    newLevel: activeResearchJob.newLevel
                });
            } else {
                // research is still in progress ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
                // prepare research update
                researchBulkUpdates.push({
                    updateOne: {
                        filter: {_id: activeResearchJob._id},
                        update: {$set: {remaining: remainingAfterResearch}}
                    }
                });
                researchWriteCounter++;

                // prepare player update
                playerBulkUpdates.push({
                    updateOne: {
                        filter: {_id: player._id},
                        update: {$set: {"resources.research.current": playerNewResource}}
                    }
                });
                playerWriteCounter++;

                // log research progress.
                newLog.playerResearchProgress.push({
                    player: player._id,
                    area: activeResearchJob.area,
                    researchCost: resToPay,
                    effectiveResearch: effectiveResearch
                });
            }

            // execute batch value if we have reached BULK_WRITES in our batch ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            if (playerWriteCounter % BULK_WRITES === 0) {
                const updatedPlayers = await Player.bulkWrite(playerBulkUpdates, {ordered: true, w: 1});
                newLog.playerWrites.matched += updatedPlayers.matchedCount;
                newLog.playerWrites.modified += updatedPlayers.modifiedCount;
                playerBulkUpdates = []; // reset bulk writes for next batch
                playerBatches++;
            }
            if (researchWriteCounter % BULK_WRITES === 0) {
                const updatedResearches = await Research.bulkWrite(researchBulkUpdates, {ordered: true, w: 1});
                newLog.researchWrites.matched += updatedResearches.matchedCount;
                newLog.researchWrites.modified += updatedResearches.modifiedCount + updatedResearches.deletedCount;
                researchBulkUpdates = []; // reset bulk writes for next batch
                researchBatches++;
            }
            // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        } else {
            // player is unable to pay for the research ================================================================
            logger.debug(
                `Player ${chalk.yellow(
                    "[" + player.ticker + "]"
                )} does not have enough resources (${resToPay}) for research, skipping.`
            );
            newLog.insufficientFunds.push(player._id);
        }

        //console.log("researchUpgrades ", researchWriteCounter, JSON.stringify(researchBulkUpdates, null, 2));
        //console.log("playerUpgrades ", playerWriteCounter, JSON.stringify(playerBulkUpdates, null, 2));
    });

    // execute the remaining bulk writes as the last batch if there are any left. ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (playerWriteCounter % BULK_WRITES !== 0) {
        const updatedPlayers = await Player.bulkWrite(playerBulkUpdates, {ordered: true, w: 1});
        newLog.playerWrites.matched += updatedPlayers.matchedCount;
        newLog.playerWrites.modified += updatedPlayers.modifiedCount;
        playerBatches++;
    }
    if (researchWriteCounter % BULK_WRITES !== 0) {
        const updatedResearches = await Research.bulkWrite(researchBulkUpdates, {ordered: true, w: 1});
        newLog.researchWrites.matched += updatedResearches.matchedCount;
        newLog.researchWrites.modified += updatedResearches.modifiedCount + updatedResearches.deletedCount;
        researchBatches++;
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    console.log(newLog.researchWrites);
    logger.info(
        `updated ${chalk.yellow(newLog.researchWrites.modified)} ${chalk.cyan("research job(s)")} for ${chalk.cyan(
            newLog.playerWrites.modified
        )} player(s) in ${chalk.yellow(playerBatches)} player batches and ${chalk.yellow(
            researchBatches
        )} research batches.`
    );

    // all done
    return {
        ...log,
        researchInsufficientFunds: newLog.insufficientFunds,
        researchnewTechLevels: newLog.newTechLevels,
        researchProgress: newLog.playerResearchProgress,
        researchPlayerWrites: newLog.playerWrites,
        researchResearchWrites: newLog.researchWrites
    };
};
