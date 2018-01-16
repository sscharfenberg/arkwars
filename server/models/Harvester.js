/***********************************************************************************************************************
 *
 * Harvester model
 * Extractors that belong to Planets and extract resources.
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const cfg = require("../config");
mongoose.Promise = global.Promise;

const harvesterSchema = new mongoose.Schema({

    // reference to planet id
    planet: {
        type: mongoose.Schema.ObjectId,
        ref: "Planet"
    },

    // reference to game id
    game: {
        type: mongoose.Schema.ObjectId,
        ref: "Game"
    },

    // reference to player id
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "player"
    },

    // type of resource that is harvested
    resourceType: {
        type: String,
        enum: cfg.player.resourceTypes.map(resource => resource.type)
    },

    // number of turns until the harvester has finished building
    turnsUntilComplete: {
        type: Number
    }

});

/*
 * virtual function to find out if the harvester is actually producing resources
 * @returns {Boolean}
 */
harvesterSchema.virtual("isHarvesting").get(function() {
    return this.turnsUntilComplete === 0;
});

module.exports = mongoose.model("Harvester", harvesterSchema);
