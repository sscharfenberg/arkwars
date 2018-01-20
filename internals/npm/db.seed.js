/***********************************************************************************************************************
 *
 * SEED DATABASE
 *
 **********************************************************************************************************************/
const path = require("path"); // https://nodejs.org/api/path.html
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const config = require("../config");
const seed = require("../../server/handlers/game/seed");
const logger = require("../utils/clientlogger");
require("dotenv").config({
    path: path.join(config.projectRoot, "server", "config", ".env")
});

// models and mockdata
require("../../server/models/");
const Game = mongoose.model("Game");
const User = mongoose.model("User");
const Player = mongoose.model("Player");
const Star = mongoose.model("Star");
const Planet = mongoose.model("Planet");
const Turn = mongoose.model("Turn");
const Suspension = mongoose.model("Suspension");
const Harvester = mongoose.model("Harvester");
const Pdu = mongoose.model("Pdu");
const games = require("../mockdata/games");
const users = require("../mockdata/users");
const players = require("../mockdata/players");
const turns = require("../mockdata/turns");
const map = require("../mockdata/mapData");
const stars = map.stars;
const planets = map.planets;
let playerHomeSystems = [];


/*
 * seed database with mock json data
 */
const seedDatabase = async () => {
    logger.info("[node] start seeding database");
    try {
        logger.debug(`[node] inserting ${games.length} games.`);
        await Game.insertMany(games);
        logger.debug(`[node] inserting ${users.length} users.`);
        await User.insertMany(users);
        logger.debug(`[node] inserting ${players.length} players.`);
        await Player.insertMany(players);
        logger.debug(`[node] inserting ${turns.length} turns.`);
        await Turn.insertMany(turns);
        logger.debug(`[node] inserting ${stars.length} stars.`);
        await Star.insertMany(stars);
        logger.debug(`[node] inserting ${planets.length} planets.`);
        await Planet.insertMany(planets);
        logger.debug(`[node] inserting ${harvesters.length} harvesters.`);
        await Harvester.insertMany(harvesters);
        logger.debug(`[node] inserting ${pdus.length} pdus.`);
        await Pdu.insertMany(pdus);
        logger.debug("[node] done inserting.");
        logger.success("[node] finished seeding database.");
    } catch (e) {
        logger.error("[node] error while seeding database.");
        logger.error(e);
    }
    process.exit(0);
};

/*
 * since maxplayers are determined by available homeSystems (which depends on size and distance)
 * we need to assign them now that stars have been created
 */
logger.info(
    `[node] modifying maxplayers for ${chalk.red(games.length)} Games.`
);
games.forEach(game => {
    let gameStars = stars.filter(
        star => star.homeSystem && star.game === game._id
    );
    game.maxPlayers = gameStars.length;
    logger.info(
        `game ${chalk.red("g" + game.number)} set to ${chalk.yellow(
            gameStars.length
        )} maxplayers`
    );
});

/*
 * assign homeSystems to players. this is normally done during enlisting.
 */
logger.info(
    `[node] selecting homesystems for ${chalk.red(players.length)} Players.`
);
players.forEach(player => {
    // available stars as homesystem have
    const gameStars = stars.filter(
        star =>
            star.game === player.game && // a) correct gameid
            star.homeSystem === true && // b) are a player homesystem
            star.owner === undefined // c) do not have an owner
    );
    const homeSystem = seed.assignRandomStar(gameStars);
    playerHomeSystems.push(homeSystem);
    logger.info(
        `[node] chosen Star ${chalk.yellow(
            homeSystem.name
        )} for player ${chalk.red("[" + player.ticker + "]")} ${chalk.cyan(
            player.name
        )}`
    );
    stars.forEach( function(star) {
        if (
            player.game === star.game &&
            star._id === homeSystem._id
        ) {
            star.owner = player._id;
        }
    });
});


/*
 * add random harvesters for testing purposes
 */
let harvesters = [];
let pdus = [];
//playerHomeSystems.forEach( star => {
//    let starPlanets = planets.filter( planet => planet.star === star._id && planet.resources.length);
//    const numHarvesters = Math.floor(starPlanets.length / 2);
//    for (let i = 0; i < numHarvesters; i++ ) {
//        const randomIndex = Math.floor(Math.random() * starPlanets.length);
//        const randomPlanet = starPlanets[randomIndex];
//        let harvester = {
//            planet: randomPlanet._id,
//            game: randomPlanet.game,
//            owner: star.owner,
//            resourceType: randomPlanet.resources[0].resourceType,
//            turnsUntilComplete: Math.random() > 0.4 ? 0 : Math.floor(Math.random() * 6)
//        };
//        logger.info(`[mockdata] created ${chalk.red(harvester.resourceType)} harvester for star ${chalk.yellow(star.name)} - ${randomPlanet.orbitalIndex}`);
//        // add PDUs
//        //const numPdus = Math.floor(Math.random() * 16);
//        //for (let j = 0; j < numPdus; j++) {
//        //    let randomType = "";
//        //    let rolled = Math.random();
//        //    if (rolled < 0.25) randomType="laser";
//        //    else if (rolled < 0.50) randomType="plasma";
//        //    else if (rolled < 0.75) randomType="railgun";
//        //    else randomType="missile";
//        //    let pdu = {
//        //        game: randomPlanet.game,
//        //        planet: randomPlanet._id,
//        //        owner: star.owner,
//        //        pduType: randomType, // tmp
//        //        turnsUntilComplete: Math.random() > 0.7 ? 0 : Math.floor(Math.random() * 10 + 1)
//        //    };
//        //    pdus.push(pdu);
//        //}
//        harvesters.push(harvester);
//        starPlanets.splice(randomIndex, 1);
//    }
//});

logger.info(`[mockdata] prepared ${chalk.yellow(pdus.length)} random PDUs.`);


// http://mongoosejs.com/docs/connections.html#use-mongo-client
mongoose.connect(process.env.DATABASE, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

try {
    seedDatabase();
} catch (err) {
    console.log(err);
}
