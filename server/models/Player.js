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
         * player resources. we define default and max values for all of them
         * so we at least have database errors if something goes wrong.
         * "storageLevel" is used as reference for upgrades
         * "current" and "max" are used as references for payments/harvesting
         */
        resources: {
            energy: {
                current: {
                    type: Number,
                    default: resTypes.find(res => res.type === "energy").default,
                    max: resTypes.find(res => res.type === "energy").storageLevels.slice(-1)[0].amount
                },
                max: {
                    type: Number,
                    default: resTypes.find(res => res.type === "energy").storageLevels.find(lvl => lvl.default).amount,
                    max:  resTypes.find(res => res.type === "energy").storageLevels.slice(-1)[0].amount
                },
                storageLevel: {
                    type: Number,
                    default: resTypes.find(res => res.type === "energy").storageLevels.find(lvl => lvl.default).lvl,
                    max: resTypes.find(res => res.type === "energy").storageLevels.length - 1
                }
            },
            food: {
                current: {
                    type: Number,
                    default: resTypes.find(res => res.type === "food").default,
                    max: resTypes.find(res => res.type === "food").storageLevels.slice(-1)[0].amount
                },
                max: {
                    type: Number,
                    default: resTypes.find(res => res.type === "food").storageLevels.find(lvl => lvl.default).amount,
                    max:  resTypes.find(res => res.type === "food").storageLevels.slice(-1)[0].amount
                },
                storageLevel: {
                    type: Number,
                    default: resTypes.find(res => res.type === "food").storageLevels.find(lvl => lvl.default).lvl,
                    max: resTypes.find(res => res.type === "food").storageLevels.length - 1
                }
            },
            minerals: {
                current: {
                    type: Number,
                    default: resTypes.find(res => res.type === "minerals").default,
                    max: resTypes.find(res => res.type === "minerals").storageLevels.slice(-1)[0].amount
                },
                max: {
                    type: Number,
                    default: resTypes.find(res => res.type === "minerals").storageLevels.find(lvl => lvl.default).amount,
                    max:  resTypes.find(res => res.type === "minerals").storageLevels.slice(-1)[0].amount
                },
                storageLevel: {
                    type: Number,
                    default: resTypes.find(res => res.type === "minerals").storageLevels.find(lvl => lvl.default).lvl,
                    max: resTypes.find(res => res.type === "minerals").storageLevels.length - 1
                }
            },
            research: {
                current: {
                    type: Number,
                    default: resTypes.find(res => res.type === "research").default,
                    max: resTypes.find(res => res.type === "research").storageLevels.slice(-1)[0].amount
                },
                max: {
                    type: Number,
                    default: resTypes.find(res => res.type === "research").storageLevels.find(lvl => lvl.default).amount,
                    max:  resTypes.find(res => res.type === "research").storageLevels.slice(-1)[0].amount
                },
                storageLevel: {
                    type: Number,
                    default: resTypes.find(res => res.type === "research").storageLevels.find(lvl => lvl.default).lvl,
                    max: resTypes.find(res => res.type === "research").storageLevels.length - 1
                }
            }
        },
        // end resources

        /*
         * tech levels
         */
        tech: {
            plasma: {
                type: Number,
                min: cfg.tech.bounds[0],
                max: cfg.tech.bounds[1],
                default: cfg.tech.areas.find(tl => tl.area === "plasma").initial
            },
            railgun: {
                type: Number,
                min: cfg.tech.bounds[0],
                max: cfg.tech.bounds[1],
                default: cfg.tech.areas.find(tl => tl.area === "railgun").initial
            },
            missile: {
                type: Number,
                min: cfg.tech.bounds[0],
                max: cfg.tech.bounds[1],
                default: cfg.tech.areas.find(tl => tl.area === "missile").initial
            },
            laser: {
                type: Number,
                min: cfg.tech.bounds[0],
                max: cfg.tech.bounds[1],
                default: cfg.tech.areas.find(tl => tl.area === "laser").initial
            },
            shields: {
                type: Number,
                min: cfg.tech.bounds[0],
                max: cfg.tech.bounds[1],
                default: cfg.tech.areas.find(tl => tl.area === "shields").initial
            },
            armour: {
                type: Number,
                min: cfg.tech.bounds[0],
                max: cfg.tech.bounds[1],
                default: cfg.tech.areas.find(tl => tl.area === "armour").initial
            }
        },
        // end tech levels

        researchPriority: {
            type: Number,
            min: cfg.tech.researchPriority[0],
            max:  cfg.tech.researchPriority[1],
            default: cfg.tech.researchPriority[2]
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

// find harvesters that are owned by this player
playerSchema.virtual("harvesters", {
    ref: "Harvester", // what model to link?
    localField: "_id", // which field on the Player?
    foreignField: "owner" // which field on the Harvester?
});

// find research jobs that are owned by this player
playerSchema.virtual("researches", {
    ref: "Research", // what model to link?
    localField: "_id", // which field on the Player?
    foreignField: "player" // which field on the Research?
});

// find storage upgrades that are owned by this player
playerSchema.virtual("storageUpgrades", {
    ref: "StorageUpgrade", // what model to link?
    localField: "_id", // which field on the Player?
    foreignField: "player" // which field on the StorageUpgrade?
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
