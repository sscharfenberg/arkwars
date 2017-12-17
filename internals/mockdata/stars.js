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

//module.exports = [
//    {
//        _id: "59bea91d2e65552c7c4226cc",
//        __v: 0,
//        name: "T6T-UW7",
//        game: "598b652d0404e604046bd35e",
//        coordX: 0,
//        coordY: 6,
//        spectral: "F"
//    },
//    {
//        _id: "59bea91d2e65552c7c4226cd",
//        __v: 0,
//        name: "K74-TG",
//        game: "598b652d0404e604046bd35e",
//        owner: "59904696a7dba10320d3a092",
//        coordX: 1,
//        coordY: 4,
//        homeSystem: true,
//        spectral: "G"
//    },
//    {
//        _id: "59bea91d2e65552c7c4226ce",
//        __v: 0,
//        name: "L35-4Z",
//        game: "598b652d0404e604046bd35e",
//        coordX: 1,
//        coordY: 9,
//        homeSystem: true,
//        spectral: "K"
//    },
//    {
//        _id: "59bea91d2e65552c7c4226cf",
//        __v: 0,
//        name: "DDO-N9",
//        game: "598b652d0404e604046bd35e",
//        coordX: 2,
//        coordY: 2,
//        spectral: "M"
//    },
//    {
//        _id: "59bea91d2e65552c7c4226d0",
//        __v: 0,
//        name: "NQH-50S",
//        game: "598b652d0404e604046bd35e",
//        coordX: 4,
//        coordY: 6,
//        spectral: "M"
//    },
//    {
//        _id: "59bea91d2e65552c7c4226d1",
//        __v: 0,
//        name: "XHB-KUY",
//        game: "598b652d0404e604046bd35e",
//        coordX: 5,
//        coordY: 4,
//        spectral: "G"
//    },
//    {
//        _id: "59bea91d2e65552c7c4226d2",
//        __v: 0,
//        name: "3J8-0",
//        game: "598b652d0404e604046bd35e",
//        coordX: 7,
//        coordY: 7,
//        homeSystem: true,
//        spectral: "K"
//    },
//    {
//        _id: "59bea91d2e65552c7c4226d3",
//        __v: 0,
//        name: "SHT-9",
//        game: "598b652d0404e604046bd35e",
//        coordX: 7,
//        coordY: 2,
//        homeSystem: true,
//        spectral: "K"
//    },
//    {
//        _id: "59bea91d2e65552c7c4226d4",
//        __v: 0,
//        name: "5PT-9",
//        game: "598b652d0404e604046bd35e",
//        coordX: 7,
//        coordY: 0,
//        spectral: "G"
//    },
//    {
//        _id: "59bea91d2e65552c7c4226d5",
//        __v: 0,
//        name: "X53-2",
//        game: "598b652d0404e604046bd35e",
//        coordX: 7,
//        coordY: 8,
//        spectral: "M"
//    },
//    {
//        _id: "59bea91d2e65552c7c4226d6",
//        __v: 0,
//        name: "YW0-V",
//        game: "598b652d0404e604046bd35e",
//        coordX: 9,
//        coordY: 3,
//        spectral: "K"
//    }
//];
