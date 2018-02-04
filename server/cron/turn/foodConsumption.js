/***********************************************************************************************************************
 *
 * population food Consumption
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const calculate = require("../../../shared/calculations");
const logger = require("../../handlers/logger/console");
require("../../models/");
const Planet = mongoose.model("Planet");
const Player = mongoose.model("Player");
const cfg = require("../../config");
const BULK_WRITES = require("../../config/cron").bulkWrites;

/*
 * population food consumption, which results in population growth
 * @param {object} game - Game model object from mongo
 * @param {object} log - the log existing before this.
 * @returns {object} log
 */
module.exports = async (game, log) => {
    const playerPromise = Player.find({game: game._id});
    const colonyPromise = Planet.find({game: game._id, population: {$gt: 0}});
    const [playersRaw, colonies] = await Promise.all([playerPromise, colonyPromise]);
    let playerBulkUpdates = [];
    let playerWriteCounter = 0;
    let playerBatches = 0;
    let planetBulkUpdates = [];
    let planetWriteCounter = 0;
    let planetBatches = 0;
    let newLog = {
        colonies: [],
        colonyWrites: {matched: 0, modified: 0},
        players: [],
        playerWrites: {matched: 0, modified: 0}
    };
    let players = playersRaw.map(player => {
        return {
            player: player._id,
            resources: {food: {current: player.resources.food.current}},
            stars: player.stars.map(star => `${star._id}`)
        };
    });
    logger.info(
        `processing population ${chalk.cyan("food consumption")} for ${chalk.cyan(colonies.length)} colonies and ${chalk.yellow(
            players.length
        )} player.`
    );

    /*
     * loop colonies - async because we might need to do a batch write
     */
    colonies.forEach(async colony => {
        // who owns this colony?
        const owner = players.find(player => player.stars.includes(`${colony.star}`));
        // TODO: create food crisis report if true
        const notEnoughFood = colony.foodConsumptionTotal > owner.resources.food.current;
        // if not enough food, use remaining resouces to feed population.
        // otherwise, use calculated (rounded up) total consumption
        let trueFoodConsumptionPerPop = notEnoughFood
            ? owner.resources.food.current / colony.population
            : colony.foodConsumptionPerPop;
        // if not enough food, set food resources to zero
        // otherwise, subtract calculated consumption from resources
        players.find(player => player.stars.includes(`${colony.star}`)).resources.food.current = notEnoughFood
            ? 0
            : owner.resources.food.current - colony.foodConsumptionTotal;
        // calculate new population
        let newPop = calculate.populationGrowth(colony.population, trueFoodConsumptionPerPop);
        if (newPop > cfg.planets.population.bounds[1]) {
            newPop = cfg.planets.population.bounds[1]; // enforce max population
        }
        let diff = newPop - colony.population;
        // calculations done, now prepare log
        newLog.colonies.push({
            planet: colony._id,
            newPop,
            diff,
            trueFoodConsumptionPerPop
        });
        // add planet update to bulk writes
        planetBulkUpdates.push({
            updateOne: {
                filter: {_id: colony._id},
                update: {$set: {population: newPop}}
            }
        });
        planetWriteCounter++;
        // execute batch value if we have reached BULK_WRITES in our batch
        if (planetWriteCounter % BULK_WRITES === 0) {
            const updatedPlanets = await Planet.bulkWrite(planetBulkUpdates, {ordered: true, w: 1});
            newLog.colonyWrites.matched += updatedPlanets.matchedCount;
            newLog.colonyWrites.modified += updatedPlanets.modifiedCount;
            planetBulkUpdates = []; // reset bulk writes for next batch
            planetBatches++;
        }
    });

    /*
     * loop players - async because we might need to do a batch write
     */
    players.forEach(async player => {
        // add player to bulk writes
        playerBulkUpdates.push({
            updateOne: {
                filter: {_id: player.player},
                update: {$set: {"resources.food.current": player.resources.food.current}}
            }
        });
        // prepare log
        newLog.players.push({
            id: player.player,
            food: player.resources.food.current
        });
        playerWriteCounter++;
        // execute batch value if we have reached BULK_WRITES in our batch
        if (playerWriteCounter % BULK_WRITES === 0) {
            const updatedPlayers = await Player.bulkWrite(playerBulkUpdates, {ordered: true, w: 1});
            newLog.playerWrites.matched += updatedPlayers.matchedCount;
            newLog.playerWrites.modified += updatedPlayers.modifiedCount;
            playerBulkUpdates = []; // reset bulk writes for next batch
            playerBatches++;
        }
    });

    /*
     * execute the remaining bulk writes as the last batch if there are any left.
     */
    if (planetWriteCounter % BULK_WRITES !== 0) {
        const updatedPlanets = await Planet.bulkWrite(planetBulkUpdates, {ordered: true, w: 1});
        newLog.colonyWrites.matched += updatedPlanets.matchedCount;
        newLog.colonyWrites.modified += updatedPlanets.modifiedCount;
        planetBatches++;
    }
    if (playerWriteCounter % BULK_WRITES !== 0) {
        const updatedPlayers = await Player.bulkWrite(playerBulkUpdates, {ordered: true, w: 1});
        newLog.playerWrites.matched += updatedPlayers.matchedCount;
        newLog.playerWrites.modified += updatedPlayers.modifiedCount;
        playerBatches++;
    }

    logger.info(
        `updated ${chalk.yellow(newLog.colonyWrites.modified)} ${chalk.cyan("colony updates")} in ${chalk.yellow(
            planetBatches
        )} batches.`
    );
    logger.info(
        `updated ${chalk.yellow(newLog.playerWrites.modified)} ${chalk.cyan("player updates")} in ${chalk.yellow(
            playerBatches
        )} batches.`
    );

    // all done
    return {
        ...log,
        colonyPopulationGrowth: newLog.colonies,
        colonyPopulationGrowthWrites: newLog.colonyWrites,
        colonyFoodConsumptionPlayerChanges: newLog.players,
        colonyFoodConsumptionPlayerWrites: newLog.playerWrites
    };
};
