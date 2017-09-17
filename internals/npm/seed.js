/***********************************************************************************************************************
 *
 * SEED DATABASE
 *
 * @type {Node.js}
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose");
const path = require("path"); // https://nodejs.org/api/path.html
const fs = require("fs");
const config = require("../config");
const logger = require("../utils/clientlogger");
require("dotenv").config({
    path: path.join(config.projectRoot, "server", "config", ".env")
});

// models and mockdata
const Game = require("../../server/models/Game");
const User = require("../../server/models/User");
const Player = require("../../server/models/Player");
const Star = require("../../server/models/Star");
const Planet = require("../../server/models/Planet");
const games = require("../mockdata/games");
const users = require("../mockdata/users");
const players = require("../mockdata/players");
const stars = require("../mockdata/stars");
const planets = require("../mockdata/planets");

// http://mongoosejs.com/docs/connections.html#use-mongo-client
mongoose.connect(process.env.DATABASE, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

/*
 * prune database and throw everything away.
 */
async function pruneDatabase() {
    logger.info("[node] deleting collections ...");
    try {
        await Game.remove();
        logger.debug("[node] games removed.");
        await User.remove();
        logger.debug("[node] users removed.");
        await Player.remove();
        logger.debug("[node] players removed.");
        await Star.remove();
        logger.debug("[node] starss removed.");
        await Planet.remove();
        logger.debug("[node] planets removed.");
        logger.success("[node] collections deleted.");
    } catch (e) {
        logger.error("[node] error while deleting collections.");
        logger.error(e);
    }
    process.exit(0);
}

/*
 * seed database with mock json data
 */
async function seedDatabase() {
    logger.info("[node] start seeding database");
    try {
        await Game.insertMany(games);
        logger.info(`[node] inserting ${games.length} games.`);
        await User.insertMany(users);
        logger.info(`[node] inserting ${users.length} users.`);
        await Player.insertMany(players);
        logger.info(`[node] inserting ${players.length} players.`);
        await Star.insertMany(stars);
        logger.info(`[node] inserting ${stars.length} stars.`);
        await Planet.insertMany(planets);
        logger.info(`[node] inserting ${planets.length} planets.`);
        logger.success("[node] done, database seeded!");
    } catch (e) {
        logger.error("[node] error while seeding database.");
        logger.error(e);
    }
    process.exit(0);
}

if (process.argv.includes("--prune")) {
    try { pruneDatabase(); }
    catch(err) { console.log(err) }

} else if (process.argv.includes("--seed")) {
    try { seedDatabase(); }
    catch(err) { console.log(err) }
}
