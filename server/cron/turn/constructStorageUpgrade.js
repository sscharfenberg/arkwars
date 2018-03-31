/***********************************************************************************************************************
 *
 * storage upgrade production
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const logger = require("../../handlers/logger/console");
require("../../models/");
const StorageUpgrade = mongoose.model("StorageUpgrade");
const Player = mongoose.model("Player");
const cfg = require("../../config");
const BULK_WRITES = require("../../config/cron").bulkWrites;

/*
 * research tech levels
 * @param {object} game - Game model object from mongo
 * @param {object} log - the log existing before this.
 * @returns {object} log
 */
module.exports = async (game, log) => {
    const newLog = {
        constructing: 0,
        upgradeWrites: {matched: 0, modified: 0},
        playerWrites: {matched: 0, modified: 0},
    };
    const processedUpgrades = await StorageUpgrade.updateMany(
        {turnsUntilComplete: {$ne: 0}, game: game._id},
        {$inc: {turnsUntilComplete: -1}},
        {new: true, runValidators: true, context: "query"}
    );
    newLog.constructing = processedUpgrades.nModified;
    logger.info(
        `processed construction of ${chalk.yellow(newLog.constructing)} ${chalk.cyan("storage upgrades")}.`
    );

    // check for finished upgrades
    const finishedUpgrades = await StorageUpgrade.find({turnsUntilComplete: 0, game: game._id});
    let storageUpgradesBulkUpdates = [];
    let playerBulkUpdates = [];
    finishedUpgrades.forEach(upgrade => {
        // delete storage upgrade
        storageUpgradesBulkUpdates.push({
            deleteOne: {
                filter: {_id: upgrade._id}
            }
        });
        // update player
        let set = {};
        set["resources." + upgrade.area + ".storageLevel"] = upgrade.newLevel;
        set["resources." + upgrade.area + ".max"] = cfg.player.resourceTypes
            .find(res => res.type === upgrade.area).storageLevels
            .find(lvl => lvl.lvl === upgrade.newLevel).amount;
        playerBulkUpdates.push({
            updateOne: {
                filter: {_id: upgrade.player},
                update: {$set: set}
            }
        });
    });

    //console.log(JSON.stringify(storageUpgradesBulkUpdates, null, 2));
    //console.log(JSON.stringify(playerBulkUpdates, null, 2));

    // execute batch ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // we only use one batch because it is hard to believe that 100+ storage upgrades finish at the same time
    if (storageUpgradesBulkUpdates.length > 0) {
        const updatedStorageUpgrades = await StorageUpgrade.bulkWrite(storageUpgradesBulkUpdates, {ordered: true, w: 1});
        newLog.upgradeWrites.matched = updatedStorageUpgrades.matchedCount;
        newLog.upgradeWrites.modified = updatedStorageUpgrades.modifiedCount + updatedStorageUpgrades.deletedCount;
    }
    if (playerBulkUpdates.length > 0) {
        const updatedPlayers = await Player.bulkWrite(playerBulkUpdates, {ordered: true, w: 1});
        newLog.playerWrites.matched += updatedPlayers.matchedCount;
        newLog.playerWrites.modified += updatedPlayers.modifiedCount + updatedPlayers.deletedCount;
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    if (storageUpgradesBulkUpdates.length && playerBulkUpdates.length) {
        logger.debug(`finished ${chalk.yellow(newLog.upgradeWrites.modified)} ${chalk.cyan("storage upgrades")}.`);
    }

    // all done
    return {
        ...log,
        storageUpgradesConstructing: newLog.constructing,
        storageUpgradesWrites: newLog.upgradeWrites,
        storateUpgradesPlayerWrites: newLog.playerWrites
    };
};
