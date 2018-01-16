/***********************************************************************************************************************
 *
 * Planet model
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const cfg = require("../config");
mongoose.Promise = global.Promise;

const planetSchema = new mongoose.Schema({
    // reference to game id
    game: {
        type: mongoose.Schema.ObjectId,
        ref: "Game"
    },

    // reference to star id
    star: {
        type: mongoose.Schema.ObjectId,
        ref: "Star"
    },

    // planet type
    type: {
        type: String,
        enum: cfg.planets.types.map(planetType => planetType.name)
    },

    // orbital index
    orbitalIndex: {
        type: Number,
        min: 1, // 0 = sun
        max: cfg.stars.planets.player[1] + 4 // +1 because of the sun, +3 because of max planets mod.
    },

    /*
     * "resources" is an array of resource-objects
     */
    resources: [
        {
            resourceType: String, // type of the resource
            slots: Number, // the number of available extractor slots
            value: Number // the grade of the resources - a modifier for production
        }
    ]

});

// find harvesters where harvester.planet = planet._id
planetSchema.virtual("harvesters", {
    ref: "Harvester", // what model to link?
    localField: "_id", // which field on the Planet?
    foreignField: "planet" // which field on the Harvester?
});

// find Pdus where pdu.planet = planet._id
planetSchema.virtual("pdus", {
    ref: "Pdu", // what model to link?
    localField: "_id", // which field on the Planet?
    foreignField: "planet" // which field on the Pdu?
});


module.exports = mongoose.model("Planet", planetSchema);
