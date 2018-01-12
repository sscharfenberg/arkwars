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

    // reference to star id
    resourceType: {
        type: String,
        enum: cfg.player.resourceTypes.map(resource => resource.type)
    },

    // number of turns until the extractor has finished building
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
