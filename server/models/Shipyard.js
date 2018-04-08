/***********************************************************************************************************************
 *
 * Shipyard model
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
mongoose.Promise = global.Promise;
const cfg = require("../config");

const shipyardSchema = new mongoose.Schema({

    // reference to planet id
    planet: {
        type: mongoose.Schema.ObjectId,
        ref: "Planet",
        required: true
    },

    // reference to game id
    game: {
        type: mongoose.Schema.ObjectId,
        ref: "Game",
        required: true
    },

    // reference to player id
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "Player",
        required: true
    },

    // maximum ship hulltype that can be constructed here
    hullTypes: [
        {
            type: String,
            enum: cfg.shipyards.hullTypes.map(hull => hull.name)
        }
    ],

    // turns until the shipyard is constructed/upgraded
    turnsUntilComplete: {
        type: Number
    }

});

/*
 * virtual function to find out if the shipyard is active
 * @returns {Boolean}
 */
shipyardSchema.virtual("isActive").get(function() {
    return this.turnsUntilComplete === 0;
});

module.exports = mongoose.model("Shipyard", shipyardSchema);
