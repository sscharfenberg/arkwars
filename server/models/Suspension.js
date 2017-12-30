/***********************************************************************************************************************
 *
 * Game model
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const moment = require("moment"); // https://momentjs.com/
mongoose.Promise = global.Promise;

const suspensionSchema = new mongoose.Schema({
    // ID of the user that is suspended
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: "true"
    },

    // ID of the admin that suspended the user
    by: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: "true"
    },

    // ISO Date when the suspension runs out
    until: {
        type: Date,
        required: "true"
    },

    // ISO Date when the user was suspended
    dateSuspended: {
        type: Date,
        required: "true",
        default: moment().toISOString()
    },

    // reason why the user was suspended
    reason: {
        type: String,
        required: true
    },

    // was this suspension canceled? Undefined by default
    canceled: {
        type: Boolean
    }
});

module.exports = mongoose.model("Suspension", suspensionSchema);
