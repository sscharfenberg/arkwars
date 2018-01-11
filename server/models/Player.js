/***********************************************************************************************************************
 *
 * Game model
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const moment = require("moment"); // https://momentjs.com/
const cfg = require("../config");
mongoose.Promise = global.Promise;

const playerSchema = new mongoose.Schema(
    {
        // reference to game id
        game: {type: mongoose.Schema.ObjectId, ref: "Game"},

        // reference to user id
        user: {type: mongoose.Schema.ObjectId, ref: "User"},

        // name of empire
        name: {
            type: String,
            required: true,
            minlength: cfg.player.name.bounds[0],
            maxlength: cfg.player.name.bounds[1]
        },

        // can users enlist?
        ticker: {
            type: String,
            required: true,
            minlength: cfg.player.ticker.bounds[0],
            maxlength: cfg.player.ticker.bounds[1]
        },

        // date of player creation
        created: {
            type: Date,
            default: moment().toISOString()
        },

        /*
         * global player resources. we define default and max values for all of them
         * so we at least have database errors if something goes wrong.
         */
        resources: {
            energy: {
                current: {
                    type: Number,
                    default: cfg.player.resourceTypes[0].start,
                    max:
                        cfg.player.resourceTypes[0].storage.start +
                        cfg.player.resourceTypes[0].storage.increase.steps *
                            cfg.player.resourceTypes[0].storage.increase.by
                },
                storage: {
                    type: Number,
                    default: cfg.player.resourceTypes[0].storage.start,
                    max:
                        cfg.player.resourceTypes[0].storage.start +
                        cfg.player.resourceTypes[0].storage.increase.steps *
                            cfg.player.resourceTypes[0].storage.increase.by
                }
            },
            minerals: {
                current: {
                    type: Number,
                    default: cfg.player.resourceTypes[1].start,
                    max:
                        cfg.player.resourceTypes[1].storage.start +
                        cfg.player.resourceTypes[1].storage.increase.steps *
                            cfg.player.resourceTypes[1].storage.increase.by
                },
                storage: {
                    type: Number,
                    default: cfg.player.resourceTypes[1].storage.start,
                    max:
                        cfg.player.resourceTypes[1].storage.start +
                        cfg.player.resourceTypes[1].storage.increase.steps *
                            cfg.player.resourceTypes[1].storage.increase.by
                }
            },
            food: {
                current: {
                    type: Number,
                    default: cfg.player.resourceTypes[2].start,
                    max:
                        cfg.player.resourceTypes[2].storage.start +
                        cfg.player.resourceTypes[2].storage.increase.steps *
                            cfg.player.resourceTypes[2].storage.increase.by
                },
                storage: {
                    type: Number,
                    default: cfg.player.resourceTypes[2].storage.start,
                    max:
                        cfg.player.resourceTypes[2].storage.start +
                        cfg.player.resourceTypes[2].storage.increase.steps *
                            cfg.player.resourceTypes[2].storage.increase.by
                }
            },
            research: {
                current: {
                    type: Number,
                    default: cfg.player.resourceTypes[3].start,
                    max:
                        cfg.player.resourceTypes[3].storage.start +
                        cfg.player.resourceTypes[3].storage.increase.steps *
                            cfg.player.resourceTypes[3].storage.increase.by
                },
                storage: {
                    type: Number,
                    default: cfg.player.resourceTypes[3].storage.start,
                    max:
                        cfg.player.resourceTypes[3].storage.start +
                        cfg.player.resourceTypes[3].storage.increase.steps *
                            cfg.player.resourceTypes[3].storage.increase.by
                }
            }
        }
    },
    {
        toJSON: {virtuals: true},
        toOjbect: {virtuals: true}
    }
);

// Define our indexes
playerSchema.index({
    namename: "text",
    ticker: "text"
});

// find stars that are owned by this player
playerSchema.virtual("stars", {
    ref: "Star", // what model to link?
    localField: "_id", // which field on the Player?
    foreignField: "owner" // which field on the Star?
});

// auto populate games
function autopopulate(next) {
    this.populate("game");
    this.populate("stars");
    next();
}
playerSchema.pre("find", autopopulate);
playerSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("Player", playerSchema);
