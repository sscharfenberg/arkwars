/***********************************************************************************************************************
 *
 * Research model
  *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const cfg = require("../config");
mongoose.Promise = global.Promise;

const researchSchema = new mongoose.Schema({

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

    // research work remaining to finish this project
    remaining: {
        type: Number,
        required: true
    },

    // the amount of research work that is done in a turn
    work: {
        type: Number,
        required: true
    },

    // order of research projects. only the research project with the lowest order is worked on
    order: {
        type: Number,
        required: true
    }

});

module.exports = mongoose.model("Research", researchSchema);
