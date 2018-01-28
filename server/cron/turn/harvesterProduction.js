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

/*
 * harvesters producing actual resorces.
 * @param {object} game - Game model object from mongo
 * @param {object} log - the log existing before this.
 * @returns {object} log
 */
const playerHarvesterProduction = async (game, log) => {
    logger.info(`start processing harvester production.`);
    const playerPromise = Player.find({game: game._id}).populate("harvesters");
    const planetPromise = Planet.find({game: game._id});
    const [players, planets] = await Promise.all([playerPromise, planetPromise]);
    let producingHarvesters = 0;
    let changedPlayerResources = players.map(player => {
        return {
            player: player._id,
            resources: player.resources
        };
    });
    // loop all players from the game
    players.forEach(player => {
        // filter the harvesters by the ones that are actually harvesting
        player.harvesters.filter(harvester => harvester.isHarvesting).forEach(harvester => {
            // base production value
            const harvesterRules = cfg.harvesters.build.find(hT => hT.type === harvester.resourceType);
            let baseProduction = harvesterRules.baseProduction;
            // modified by planet resource value
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
    logger.info(`processed ${chalk.cyan(producingHarvesters)} producing harvesters.`);
    // we have the new values, now updated db.
    /*
     * TODO: this will probably not work for 50+ players. find a better way to do this, maybe process in batches
     */
    let updatePromises = [];
    changedPlayerResources.forEach(slot => {
        updatePromises.push(
            Player.findOneAndUpdate(
                {_id: slot.player},
                {
                    $set: {
                        "resources.energy.current": slot.resources.energy.current,
                        "resources.food.current": slot.resources.food.current,
                        "resources.minerals.current": slot.resources.minerals.current,
                        "resources.research.current": slot.resources.research.current
                    }
                },
                {runValidators: true, context: "query"}
            )
        );
    });
    // all promises prepared, lets do them all at once
    logger.info(`executing ${chalk.cyan(updatePromises.length)} user update promises.`);
    await Promise.all(updatePromises);
    logger.info(`${chalk.yellow(updatePromises.length)} user update promises finished.`);
    return {
        harvesterProdResChanges: changedPlayerResources,
        ...log
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


module.exports = playerHarvesterProduction;
