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
const games = require("../mockdata/games");
const users = require("../mockdata/users");
const players = require("../mockdata/players");
const turns = require("../mockdata/turns");
const map = require("../mockdata/mapData");
const stars = map.stars;
const planets = map.planets;


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
    `[node] seeding homesystems for ${chalk.red(players.length)} Players.`
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
    logger.info(
        `[node] chosen Star ${chalk.yellow(
            homeSystem.name
        )} for player ${chalk.red("[" + player.ticker + "]")} ${chalk.cyan(
            player.name
        )}`
    );
    stars.forEach( function(star) {
        /* become owner if ...
         * we don't have the ID of the stars, so we need to match by name and coords
         */
        if (
            player.game === star.game && // a) correct gameid
            star.name === homeSystem.name && // b) name matches chosen name
            star.coordX === homeSystem.coordX && // c) coordX matches chosen coordX
            star.coordY === homeSystem.coordY // d) and, just to be extra sure, coordY matches as well.
        ) {
            star.owner = player._id;
        }
    });
});


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
