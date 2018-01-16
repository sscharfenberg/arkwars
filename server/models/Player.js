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
                        cfg.player.resourceTypes[0].max.start +
                        cfg.player.resourceTypes[0].max.increase.steps *
                            cfg.player.resourceTypes[0].max.increase.by
                },
                max: {
                    type: Number,
                    default: cfg.player.resourceTypes[0].max.start,
                    max:
                        cfg.player.resourceTypes[0].max.start +
                        cfg.player.resourceTypes[0].max.increase.steps *
                            cfg.player.resourceTypes[0].max.increase.by
                }
            },
            food: {
                current: {
                    type: Number,
                    default: cfg.player.resourceTypes[1].start,
                    max:
                        cfg.player.resourceTypes[1].max.start +
                        cfg.player.resourceTypes[1].max.increase.steps *
                            cfg.player.resourceTypes[1].max.increase.by
                },
                max: {
                    type: Number,
                    default: cfg.player.resourceTypes[1].max.start,
                    max:
                        cfg.player.resourceTypes[1].max.start +
                        cfg.player.resourceTypes[1].max.increase.steps *
                            cfg.player.resourceTypes[1].max.increase.by
                }
            },
            minerals: {
                current: {
                    type: Number,
                    default: cfg.player.resourceTypes[2].start,
                    max:
                        cfg.player.resourceTypes[2].max.start +
                        cfg.player.resourceTypes[2].max.increase.steps *
                            cfg.player.resourceTypes[2].max.increase.by
                },
                max: {
                    type: Number,
                    default: cfg.player.resourceTypes[2].max.start,
                    max:
                        cfg.player.resourceTypes[2].max.start +
                        cfg.player.resourceTypes[2].max.increase.steps *
                            cfg.player.resourceTypes[2].max.increase.by
                }
            },
            research: {
                current: {
                    type: Number,
                    default: cfg.player.resourceTypes[3].start,
                    max:
                        cfg.player.resourceTypes[3].max.start +
                        cfg.player.resourceTypes[3].max.increase.steps *
                            cfg.player.resourceTypes[3].max.increase.by
                },
                max: {
                    type: Number,
                    default: cfg.player.resourceTypes[3].max.start,
                    max:
                        cfg.player.resourceTypes[3].max.start +
                        cfg.player.resourceTypes[3].max.increase.steps *
                            cfg.player.resourceTypes[3].max.increase.by
                }
            }
        }
        // end resources
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

// find harvesters that are owned by this player
playerSchema.virtual("harvesters", {
    ref: "Harvester", // what model to link?
    localField: "_id", // which field on the Player?
    foreignField: "owner" // which field on the Harvester?
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
