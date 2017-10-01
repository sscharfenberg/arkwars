/***********************************************************************************************************************
 *
 * Planet model
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
//const moment = require("moment"); // https://momentjs.com/
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
    }
});

module.exports = mongoose.model("Planet", planetSchema);
