/***********************************************************************************************************************
 *
 * GAME SETUP
 * this handles everything that needs to be setup for a new game - starting colonies, shipyards, shipClasses etc
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../../handlers/logger/console");
const mongoose = require("mongoose"); // http://mongoosejs.com/
const {selectPlayerStartingColony} = require("../../handlers/game/seed");
require("../../models/");
const Player = mongoose.model("Player");
const Planet = mongoose.model("Planet");
const Shipyard = mongoose.model("Shipyard");
const cfg = require("../../config");

/*
 * start a specific game
 */
const playerSetup = async game => {
    const playerPromise = Player.find({game: game._id}).populate("stars");
    const planetPromise = Planet.find({game: game._id});
    const [players, planets] = await Promise.all([playerPromise, planetPromise]);
    logger.debug(`setting up ${chalk.yellow(players.length)} players for ${chalk.red("g" + game.number)}`);
    let planetBuldUpdates = [];
    let shipyards = [];
    let shipClasses = [];

    /*
     * prepare updates for each player
     */
    players.forEach(player => {
        if (player.stars.length > 1) {
            logger.warn(`player ${player.name} #${player.id} has ${player.stars.length} stars.`);
        }
        const homePlanets = planets.filter(planet => `${planet.star}` === `${player.stars[0]._id}`);

        // 1) Select a planet for each player and assign it a starting colony
        const colonyId = selectPlayerStartingColony(homePlanets);
        planetBuldUpdates.push({
            updateOne: {
                filter: {_id: colonyId},
                update: {$set: {population: cfg.planets.population.startingColony}}
            }
        });

        // 2) Give each player a shipyard on the colony planet
        shipyards.push(
            new Shipyard({
                planet: colonyId,
                owner: player._id,
                game: game._id,
                hullTypes: cfg.shipyards.hullTypes.filter(ht => ht.default).map(ht => ht.name),
                turnsUntilComplete: 0
            })
        );

        // 3) TODO Setup base ship classes for each player
    });

    /*
     * preparations complete, now send everything to database
     */
    logger.info(`preparations complete, now sending {
  "${chalk.cyan("planetUpdates")}": ${chalk.yellow(planetBuldUpdates.length)},
  "${chalk.cyan("newShipyards")}": ${chalk.yellow(shipyards.length)},
  "${chalk.cyan("defaultShipClasses")}": ${chalk.yellow(shipClasses.length)}
} to database.`);
    const planetUpdatePromise = Planet.bulkWrite(planetBuldUpdates, {ordered: true, w: 1});
    const shipyardInsertPromise = Shipyard.insertMany(shipyards);
    const [updatedPlanets, newShipyards] = await Promise.all([planetUpdatePromise, shipyardInsertPromise]);

    if (!updatedPlanets || !newShipyards) {
        logger.error(
            `${chalk.red("DB Error")}. planetUpdates: ${JSON.stringify(
                planetBuldUpdates,
                null,
                2
            )} new Shipyards ${JSON.stringify(newShipyards, null, 2)}`
        );
        logger.error(`updatedPlanets: ${JSON.stringify(updatedPlanets)} newShipyards: ${JSON.stringify(newShipyards)}`);
    } else {
        logger.success(
            `finished setting up ${chalk.yellow(players.length)} players for ${chalk.red("g" + game.number)}`
        );
    }
};

module.exports = {playerSetup};
