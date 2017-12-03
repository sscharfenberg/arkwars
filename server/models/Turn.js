/***********************************************************************************************************************
 *
 * Turn model
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
//const cfg = require("../config");
mongoose.Promise = global.Promise;

const turnSchema = new mongoose.Schema({
    // reference to game id
    game: {
        type: mongoose.Schema.ObjectId,
        ref: "Game"
    },

    // turn number
    number: {
        type: Number,
        min: 0,
        default: 0
    },

    // unique slug to identify turn
    slug: {
        type: String,
        unique: true,
        required: true
    },

    // datetime of turn calculation start
    dateProcessed: {
        type: Date,
        required: true
    },

    // JSON log string
    log: {
        type: String
    }
});

// Define our indexes
turnSchema.index({
    slug: "text"
});

// find planets where the stars _id property === planets star property
//turnSchema.virtual("planets", {
//    ref: "Planet", // what model to link?
//    localField: "_id", // which field on the star?
//    foreignField: "star" // which field on the planet?
//});

module.exports = mongoose.model("Turn", turnSchema);
