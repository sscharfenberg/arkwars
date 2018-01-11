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

stars.forEach(star => {
    let owner = star.homeSystem ? 2 : 1;
    let numPlanets = seed.getNumPlanets(
        star.spectral,
        owner,
        cfg.stars.spectralTypes
    );
    for (let counter = 0; counter < numPlanets; counter++) {
        planets.push(seed.randomPlanet(star.game, star._id, counter + 1, star.homeSystem));
    }
});

logger.info(`[mockdata] created ${chalk.cyan(planets.length)} planets.`)

module.exports = {
    stars,
    planets
};
