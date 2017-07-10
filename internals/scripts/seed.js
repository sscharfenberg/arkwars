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
const logger = require("./utils/clientlogger");
const Game = require("../../server/app/models/Game");
const games = require("../mockdata/games");
require("dotenv").config({
    path: path.join(config.projectRoot, "config", ".env")
});

mongoose.connect(process.env.DATABASE, {
    useMongoClient: true // http://mongoosejs.com/docs/connections.html#use-mongo-client
});
mongoose.Promise = global.Promise;


/*
 * prune database and throw everything away.
 */
async function pruneDatabase() {
    logger.info("[node] pruning database ...");
    await Game.remove();
    logger.success("database pruned.");
    process.exit(0);
}


/*
 * seed database with mock json data
 */
async function seedDatabase() {
    logger.info("[node] start seeding database");
    try {
        await Game.insertMany(games);
        logger.debug(`inserting ${games.length} games`);
        logger.success("done, database seeded!");
        process.exit(0);
    } catch(e) {
        logger.error("error while seeding database.");
        logger.error(e);
        process.exit(0);
    }
}


if (process.argv.includes("--prune")) {
    pruneDatabase();
} else if (process.argv.includes("--seed")) {
    seedDatabase();
}

