/***********************************************************************************************************************
 *
 * Game model
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const moment = require("moment"); // https://momentjs.com/
const cfg = require("../config");
const resTypes = cfg.player.resourceTypes;
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
         * CAUTION: this references resType by index; this needs to be synced to the order of player resTypes
         * the advantage of this object syntax is that we can get certain resources much faster and easier
         * than as an array
         */
        resources: {
            energy: {
                current: {
                    type: Number,
                    default: resTypes[0].start,
                    max: resTypes[0].max.start + resTypes[0].max.increase.steps * resTypes[0].max.increase.by
                },
                max: {
                    type: Number,
                    default: resTypes[0].max.start,
                    max: resTypes[0].max.start + resTypes[0].max.increase.steps * resTypes[0].max.increase.by
                },
                lastChange: {
                    type: Number,
                    default: 0
                }
            },
            food: {
                current: {
                    type: Number,
                    default: resTypes[1].start,
                    max: resTypes[1].max.start + resTypes[1].max.increase.steps * resTypes[1].max.increase.by
                },
                max: {
                    type: Number,
                    default: resTypes[1].max.start,
                    max: resTypes[1].max.start + resTypes[1].max.increase.steps * resTypes[1].max.increase.by
                },
                lastChange: {
                    type: Number,
                    default: 0
                }
            },
            minerals: {
                current: {
                    type: Number,
                    default: resTypes[2].start,
                    max: resTypes[2].max.start + resTypes[2].max.increase.steps * resTypes[2].max.increase.by
                },
                max: {
                    type: Number,
                    default: resTypes[2].max.start,
                    max: resTypes[2].max.start + resTypes[2].max.increase.steps * resTypes[2].max.increase.by
                },
                lastChange: {
                    type: Number,
                    default: 0
                }
            },
            research: {
                current: {
                    type: Number,
                    default: resTypes[3].start,
                    max: resTypes[3].max.start + resTypes[3].max.increase.steps * resTypes[3].max.increase.by
                },
                max: {
                    type: Number,
                    default: resTypes[3].max.start,
                    max: resTypes[3].max.start + resTypes[3].max.increase.steps * resTypes[3].max.increase.by
                },
                lastChange: {
                    type: Number,
                    default: 0
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
