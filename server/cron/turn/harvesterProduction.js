/***********************************************************************************************************************
 *
 * harvester production
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../../handlers/logger/console");
require("../../models/");
const Planet = mongoose.model("Planet");
const Player = mongoose.model("Player");
const cfg = require("../../config");
const BULK_WRITES = require("../../config/cron").bulkWrites;

/*
 * harvesters producing actual resorces.
 * @param {object} game - Game model object from mongo
 * @param {object} log - the log existing before this.
 * @returns {object} log
 */
const harvesterProduction = async (game, log) => {
    const playerPromise = Player.find({game: game._id}).populate("harvesters");
    const planetPromise = Planet.find({game: game._id});
    const [players, planets] = await Promise.all([playerPromise, planetPromise]);
    let producingHarvesters = 0;
    let playerLog = {matched: 0, modified: 0};
    let changedPlayerResources = players.map(player => {
        return {
            player: player._id,
            resources: player.resources
        };
    });
    let playerBulkUpdates = [];
    let playerWriteCounter = 0;
    let playerBatches = 0;

    /*
     * loop all players, then all harvesters to prepare modified resources
     */
    players.forEach(player => {
        // filter the harvesters by the ones that are actually harvesting
        player.harvesters.filter(harvester => harvester.isHarvesting).forEach(harvester => {
            // base production value
            const harvesterRules = cfg.harvesters.types.find(hT => hT.type === harvester.resourceType);
            let baseProduction = harvesterRules.baseProduction;
            // modifier for planet resource value
            let modifierResValue = planets
                .find(planet => `${planet._id}` === `${harvester.planet}`)
                .resources.find(res => res.resourceType === harvester.resourceType).value;
            // TODO: add tech level modification
            changedPlayerResources.find(cp => cp.player === player._id).resources[
                harvester.resourceType
            ].current += Math.floor(baseProduction * modifierResValue);
            producingHarvesters++;
        });
    });
    changedPlayerResources = enforceStockPileMax(changedPlayerResources);
    logger.info(`processed ${chalk.yellow(producingHarvesters)} producing harvesters.`);

    /*
     * loop players - async because we might need to do a batch write
     */
    changedPlayerResources.forEach(async slot => {
        playerBulkUpdates.push({
            updateOne: {
                filter: {_id: slot.player},
                update: {
                    $set: {
                        "resources.energy.current": slot.resources.energy.current,
                        "resources.food.current": slot.resources.food.current,
                        "resources.minerals.current": slot.resources.minerals.current,
                        "resources.research.current": slot.resources.research.current
                    }
                }
            }
        });
        playerWriteCounter++;
        /*
         * update db if we have reached BULK_WRITES updates.
         */
        if (playerWriteCounter % BULK_WRITES === 0) {
            const updatedPlayers = await Player.bulkWrite(playerBulkUpdates, {ordered: true, w: 1});
            playerLog.matched += updatedPlayers.matchedCount;
            playerLog.modified += updatedPlayers.modifiedCount;
            playerBulkUpdates = []; // reset bulk writes for next batch
            playerBatches++;
        }
    });

    /*
     * execute the remaining bulk writes as the last batch if there are any left.
     */
    if (playerWriteCounter % BULK_WRITES !== 0) {
        const updatedPlayers = await Player.bulkWrite(playerBulkUpdates, {ordered: true, w: 1});
        playerLog.matched += updatedPlayers.matchedCount;
        playerLog.modified += updatedPlayers.modifiedCount;
        playerBatches++;
    }

    logger.info(
        `updated ${chalk.yellow(playerLog.modified)} ${chalk.cyan(
            "harvester production player updates"
        )} in ${chalk.yellow(playerBatches)} batches.`
    );

    return {
        ...log,
        harvesterProdResChanges: changedPlayerResources,
        harvesterProdPlayerWrites: playerLog
    };
};

/*
 * set array values to max if current > max
 * @param {Array} changedPlayerResources - Array with resource changes
 * @returns {Array} changedPlayerResources
 */
const enforceStockPileMax = changedPlayerResources => {
    return changedPlayerResources.map(player => {
        player.resources.energy.current =
            player.resources.energy.current > player.resources.energy.max
                ? player.resources.energy.max
                : player.resources.energy.current;
        player.resources.food.current =
            player.resources.food.current > player.resources.food.max
                ? player.resources.food.max
                : player.resources.food.current;
        player.resources.minerals.current =
            player.resources.minerals.current > player.resources.minerals.max
                ? player.resources.minerals.max
                : player.resources.minerals.current;
        player.resources.research.current =
            player.resources.research.current > player.resources.research.max
                ? player.resources.research.max
                : player.resources.research.current;
        return player;
    });
};

module.exports = harvesterProduction;
