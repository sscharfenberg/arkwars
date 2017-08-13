/***********************************************************************************************************************
 *
 * Game model
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const moment = require("moment"); // https://momentjs.com/
mongoose.Promise = global.Promise;

const gameSchema = new mongoose.Schema({

    // game number
    number: {
        type: Number,
        index: { unique: true },
        required: true
    },

    // active game?
    active: {
        type: Boolean,
        default: false
    },
    // can users enlist?
    canEnlist: {
        type: Boolean,
        default: false
    },
    // turn currently processing?
    processing: {
        type: Boolean,
        default: false
    },

    // current turn number
    turn: {
        type: Number,
        min: 0,
        default: 0
    },
    // turn duration in minutes
    turnDuration: {
        type: Number,
        min: 1,
        default: 1
    },
    // date when the next turn will be processed
    turnDue: {
        type: Date
    },
    // max number of players
    maxPlayers: {
        type: Number,
        min: 1,
        default: 50
    },
    // date when the game starts
    startDate: {
        type: Date
    },

    // date of game creation
    created: {
        type: Date,
        default: moment().toISOString()
    }

});

module.exports = mongoose.model("Game", gameSchema);
