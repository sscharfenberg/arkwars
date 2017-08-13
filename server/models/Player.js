/***********************************************************************************************************************
 *
 * Game model
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const moment = require("moment"); // https://momentjs.com/
mongoose.Promise = global.Promise;

const playerSchema = new mongoose.Schema({

    // reference to game id
    game: { type: mongoose.Schema.ObjectId, ref: "Game" },

    // reference to user id
    user: { type: mongoose.Schema.ObjectId, ref: "User" },

    // name of empire
    name: {
        type: String
    },

    // can users enlist?
    ticker: {
        type: String
    },

    // date of player creation
    created: {
        type: Date,
        default: moment().toISOString()
    }

});

module.exports = mongoose.model("Player", playerSchema);
