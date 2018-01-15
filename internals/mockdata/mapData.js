/***********************************************************************************************************************
 *
 * generate planets mockdata
 *
 **********************************************************************************************************************/
const seed = require("../../server/handlers/game/seed");
let stars = require("./stars");
const cfg = require("../../server/config");
const logger = require("../../server/handlers/logger/console");
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
let planets = [];

let types = {
    terrestrial: 0,
    gas: 0,
    ice: 0,
    iron: 0,
    desert: 0,
    toxic: 0,
    carbon: 0,
    tomb: 0
};

stars.forEach(star => {
    let owner = star.homeSystem ? 2 : 1;
    let numPlanets = seed.getNumPlanets(
        star.spectral,
        owner,
        cfg.stars.spectralTypes
    );
    for (let counter = 0; counter < numPlanets; counter++) {
        let planet = seed.randomPlanet(star.game, star._id, counter + 1, !star.homeSystem);
        planets.push(planet);
        types[planet.type] += 1;
    }
});

logger.info(`[mockdata] created ${chalk.cyan(planets.length)} planets: ${chalk.yellow(JSON.stringify(types, null, 2))}.`);

module.exports = {
    stars,
    planets
};
