/***********************************************************************************************************************
 *
 * PDU model
 * Planetary Defense Units
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const cfg = require("../config");
mongoose.Promise = global.Promise;

const pduSchema = new mongoose.Schema({

    // reference to planet id
    planet: {
        type: mongoose.Schema.ObjectId,
        ref: "Planet",
        required: true
    },

    // reference to game id
    game: {
        type: mongoose.Schema.ObjectId,
        ref: "Game",
        required: true
    },

    // reference to player id
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "Player"
    },

    // type of resource that is harvested
    pduType: {
        type: String,
        enum: cfg.pdus.types.map(pdu => pdu.type),
        required: true
    },

    // number of turns until the harvester has finished building
    turnsUntilComplete: {
        type: Number
    }

});

/*
 * virtual function to find out if the PDU is active and ready to defend
 * @returns {Boolean}
 */
pduSchema.virtual("isActive").get(function() {
    return this.turnsUntilComplete === 0;
});

module.exports = mongoose.model("Pdu", pduSchema);
