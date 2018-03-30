/***********************************************************************************************************************
 *
 * Research model
  *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
mongoose.Promise = global.Promise;

const storageUpgradeSchema = new mongoose.Schema({

    // reference to game id
    game: {
        type: mongoose.Schema.ObjectId,
        ref: "Game",
        required: true
    },

    // reference to player id
    player: {
        type: mongoose.Schema.ObjectId,
        ref: "Player"
    },

    // research area
    area: {
        type: String,
        required: true
    },

    // new Level after installing is finished
    newLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 4
    },

    turnsUntilComplete: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model("StorageUpgrade", storageUpgradeSchema);
