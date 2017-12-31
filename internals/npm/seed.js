/***********************************************************************************************************************
 *
 * SEED DATABASE
 *
 * @type {Node.js}
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const path = require("path"); // https://nodejs.org/api/path.html
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const fs = require("fs");
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
const stars = require("../mockdata/stars");
const planets = require("../mockdata/planets");
const turns = require("../mockdata/turns");

/*
 * prune database and throw everything away.
 */
const pruneDatabase = async () => {
    logger.info("[node] deleting collections ...");
    try {
        await Game.remove();
        logger.debug("[node] games removed.");
        await User.remove();
        logger.debug("[node] users removed.");
        await Player.remove();
        logger.debug("[node] players removed.");
        await Star.remove();
        logger.debug("[node] stars removed.");
        await Planet.remove();
        logger.debug("[node] planets removed.");
        await Turn.remove();
        logger.debug("[node] turns removed.");
        await Suspension.remove();
        logger.debug("[node] suspensions removed.");
        logger.success("[node] collections deleted.");
    } catch (e) {
        logger.error("[node] error while deleting collections.");
        logger.error(e);
    }
    process.exit(0);
};

/*
 * seed database with mock json data
 */
const seedDatabase = async () => {
    logger.info("[node] start seeding database");
    try {
        logger.debug(`[node] inserting ${stars.length} stars.`);
        await Star.insertMany(stars);
        logger.debug(`[node] inserting ${games.length} games.`);
        await Game.insertMany(games);
        logger.debug(`[node] inserting ${users.length} users.`);
        await User.insertMany(users);
        logger.debug(`[node] inserting ${players.length} players.`);
        await Player.insertMany(players);
        logger.debug(`[node] inserting ${planets.length} planets.`);
        await Planet.insertMany(planets);
        logger.debug(`[node] inserting ${turns.length} turns.`);
        await Turn.insertMany(turns);
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
    const gameStars = stars.filter(
        star =>
            star.game === player.game &&
            star.homeSystem === true &&
            star.owner === undefined
    );
    const homeSystem = seed.assignRandomStar(gameStars);
    let index = 0;
    stars.forEach(star => {
        if (
            player.game === star.game &&
            star.name === homeSystem.name &&
            star.coordX === homeSystem.coordX &&
            star.coordY === homeSystem.coordY
        ) {
            stars[index].owner = player._id;
        }
        index++;
    });
    logger.info(
        `[node] chosen Star ${chalk.yellow(
            homeSystem.name
        )} for player ${chalk.red("[" + player.ticker + "]")} ${chalk.cyan(
            player.name
        )}`
    );
});

// http://mongoosejs.com/docs/connections.html#use-mongo-client
mongoose.connect(process.env.DATABASE, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

if (process.argv.includes("--prune")) {
    try {
        pruneDatabase();
    } catch (err) {
        console.log(err);
    }
} else if (process.argv.includes("--seed")) {
    try {
        seedDatabase();
    } catch (err) {
        console.log(err);
    }
}
