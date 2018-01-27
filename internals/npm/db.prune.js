/***********************************************************************************************************************
 *
 * SEED DATABASE
 *
 * @type {Node.js}
 *
 **********************************************************************************************************************/
const path = require("path"); // https://nodejs.org/api/path.html
const mongoose = require("mongoose"); // http://mongoosejs.com/
const config = require("../config");
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

/*
 * prune database and throw everything away.
 */
const pruneDatabase = async () => {
    logger.info("[node] deleting collections ...");
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
    await Harvester.remove();
    logger.debug("[node] harvesters removed.");
    await Pdu.remove();
    logger.debug("[node] pdus removed.");
    // all done
    logger.success("[node] collections deleted.");
    process.exit(0);
};

// http://mongoosejs.com/docs/connections.html#use-mongo-client
mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;

try {
    pruneDatabase();
} catch (err) {
    console.log(err);
}
