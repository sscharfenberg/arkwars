const seed = require("../../server/handlers/game/seed");
let game = "598b652d0404e604046bd35e";
let stars = require("./stars");
const cfg = require("../../server/config");
let planets = [];

stars.forEach( star => {
    let owner = star.homeSystem ? 2 : 1;
    let numPlanets = seed.getNumPlanets(star.spectral, owner, cfg.stars.spectralTypes);
    for (let counter = 0; counter < numPlanets; counter++) {
        planets.push({
            game,
            star: star._id,
            type: seed.randomType(owner, cfg.planets.types),
            orbitalIndex: counter + 1
        });
    }
});

module.exports = planets;
