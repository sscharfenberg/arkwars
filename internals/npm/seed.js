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
const games = require("../mockdata/games");
const User = require("../../server/models/User");
const users = require("../mockdata/users");

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
        await User.remove();
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
        logger.debug(`[node] inserting ${games.length} games.`);
        await User.insertMany(users);
        logger.debug(`[node] inserting ${users.length} users.`);
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
