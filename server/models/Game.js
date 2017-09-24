/***********************************************************************************************************************
 *
 * Game model
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const moment = require("moment"); // https://momentjs.com/
const cfg = require("../config");
mongoose.Promise = global.Promise;

const gameSchema = new mongoose.Schema(
    {
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
        },

        // dimensions of game (width/height)
        dimensions: {
            type: Number,
            min: cfg.games.dimensions.min,
            max: cfg.games.dimensions.max
        },

        // we store the seeded map in the database temporarily, since for large maps
        // there is too much data for http requests
        seededMap: {
            type: String
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
    },
    {
        toJSON: { virtuals: true },
        toOjbect: { virtuals: true }
    }
);

// find players where player.game === game._id
gameSchema.virtual("players", {
    ref: "Player", // what model to link?
    localField: "_id", // which field on the Game?
    foreignField: "game" // which field on the Player?
});

// find stars where star.game === game._id
gameSchema.virtual("stars", {
    ref: "Star", // what model to link?
    localField: "_id", // which field on the Game?
    foreignField: "game" // which field on the Player?
});

module.exports = mongoose.model("Game", gameSchema);
