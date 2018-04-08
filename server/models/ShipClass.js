/***********************************************************************************************************************
 *
 * ShipClass model
 * this model describes ship blueprints
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
mongoose.Promise = global.Promise;
const cfg = require("../config");


const shipClassSchema = new mongoose.Schema({

    // reference to game id
    game: {
        type: mongoose.Schema.ObjectId,
        ref: "Game",
        required: true
    },

    // reference to player id
    player: {
        type: mongoose.Schema.ObjectId,
        ref: "Player",
        required: true
    },

    // ship hulltype
    hullType: {
        type: String,
        enum: cfg.shipClasses.hullTypes.map(hull => hull.name),
        required: true
    },

    // (kilo) tonnage of ship
    kto: {
        type: Number,
        min: cfg.shipClasses.tonnage[0],
        max: cfg.shipClasses.tonnage[1],
        required: true
    },

    // name of the ship class
    name: {
        type: String,
        minLength: cfg.shipClasses.name[0],
        maxLength: cfg.shipClasses.name[1],
        required: true
    },

    // FTL capable?
    ftl: {
        type: Boolean
    },

    // ship speed
    speed: {
        type: Number,
        min: cfg.shipClasses.speed[0],
        max: cfg.shipClasses.speed[1],
        required: true
    },

    // installed modules - armor, weapons etc
    modules: [
        {
            type: String
        }
    ]

});

// find ships that belong to this class
shipClassSchema.virtual("ships", {
    ref: "Ship", // what model to link?
    localField: "_id", // which field on the shipClass?
    foreignField: "shipClass" // which field on the ship?
});

module.exports = mongoose.model("ShipClass", shipClassSchema);
