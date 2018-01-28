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
    ],

    // real population value => float
    population: {
        type: Number,
        min: cfg.planets.population.bounds[0],
        max: cfg.planets.population.bounds[1],
        default: 0
    },

    // food consumption in number of resource units per population
    foodConsumptionPerPop: {
        type: Number,
        default: cfg.planets.population.food.default,
        min: cfg.planets.population.food.bounds[0],
        max: cfg.planets.population.food.bounds[1]
    }

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

/*
 * virtual function to find out if the harvester is actually producing resources
 * @returns {Boolean}
 */
planetSchema.virtual("effectivePopulation").get(function() {
    return Math.floor(this.population);
});

/*
 * virtual function to calculate total food consumption (rounded up)
 * @returns {Boolean}
 */
planetSchema.virtual("foodConsumptionTotal").get(function() {
    return Math.ceil(this.population * this.foodConsumptionPerPop);
});


module.exports = mongoose.model("Planet", planetSchema);
