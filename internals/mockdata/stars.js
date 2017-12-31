/***********************************************************************************************************************
 *
 * generate stars mockdata for our games
 *
 **********************************************************************************************************************/
const seed = require("../../server/handlers/game/seed");
const logger = require("../../server/handlers/logger/console");
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const games = require("./games");
const cfg = require("../../server/config");
let allStarObjects = [];

games.forEach(game => {
    logger.info(`generating stars for ${chalk.red("g"+game.number)}`);
    // mockdata taken mainly from server/controllers/admin/game.js@seedGamePreview()
    let stars = seed.systems(game, {}, 2, 4);
    let playerStars = seed.systems(game, {}, 3, 6);
    // set the type accordingly
    stars = stars.map(star => [star[0], star[1], 1]); // set to npc system by default.
    playerStars = playerStars.map(star => [star[0], star[1], 2]); // set to player system.
    // player systems first, npc systems last.
    let allStars = playerStars
        .concat(stars)
        .sort((a, b) => (a[0] === b[0] ? 0 : a[0] < b[0] ? -1 : 1)); // sort by row value / x
    logger.info(
        `[mockdata] generated ${chalk.magenta(
            allStars.length
        )} stars total - ${chalk.yellow(stars.length)} npc systems, ${chalk.red(
            playerStars.length
        )} player home systems.`
    );
    let seen = [];
    let starsFiltered = allStars.filter(star => {
        // convert the coords array to a string, since javascript arrays (objects)
        // are compared by reference, not by value
        // therefore, we can not simply compare arrays by using indexOf
        let coordSeen = `${star[0]}/${star[1]}`;
        if (seen.indexOf(coordSeen) > -1) return false;
        seen.push(coordSeen);
        return true;
    });
    logger.info(
        `[mockdata] ${chalk.red(
            allStars.length - starsFiltered.length
        )} duplicates removed, ${chalk.yellow(starsFiltered.length)} remaining.`
    );
    starsFiltered.forEach(point => {
        let spectral = seed.randomType(point[2], cfg.stars.spectralTypes);
        let star = {
            name: seed.getStarName(spectral),
            game: game._id,
            coordX: point[0],
            coordY: point[1],
            spectral
        };
        if (point[2] === 2) {
            star.homeSystem = true;
        }
        allStarObjects.push(star);
    });
});

module.exports = allStarObjects;

