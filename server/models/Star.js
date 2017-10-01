/***********************************************************************************************************************
 *
 * Star model
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
//const moment = require("moment"); // https://momentjs.com/
const cfg = require("../config");
mongoose.Promise = global.Promise;

const starSchema = new mongoose.Schema({
    // reference to game id
    game: {
        type: mongoose.Schema.ObjectId,
        ref: "Game"
    },

    // reference to player id
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "Player"
    },

    coordX: {
        type: Number,
        min: 0
    },
    coordY: {
        type: Number,
        min: 0
    },

    // is this a player homesystem
    homeSystem: {
        type: Boolean
    },

    // spectral type
    spectral: {
        type: String,
        enum: cfg.stars.spectralTypes.map(spectralType => spectralType.name)
    },

    // star name / designation
    name: {
        type: String
    }
});

// find planets where the stars _id property === planets star property
starSchema.virtual("planets", {
    ref: "Planet", // what model to link?
    localField: "_id", // which field on the star?
    foreignField: "star" // which field on the planet?
});

module.exports = mongoose.model("Star", starSchema);
