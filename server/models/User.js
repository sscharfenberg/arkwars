/***********************************************************************************************************************
 *
 * Game model
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const moment = require("moment"); // https://momentjs.com/
const mongodbErrorHandler = require("mongoose-mongodb-errors"); // https://www.npmjs.com/package/mongoose-mongodb-errors
const passportLocalMongoose = require("passport-local-mongoose"); // https://github.com/saintedlama/passport-local-mongoose
const cfg = require("../config");
//const validator = require("validator"); // https://www.npmjs.com/package/validator
mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    // email address
    email: {
        type: String,
        unique: true,
        required: true
    },

    // username
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },

    // locale
    locale: {
        type: String,
        enum: cfg.app.locales.map(locale => locale.name)
    },

    // avatar filename
    avatar: {
        type: String,
        default: undefined
    },

    // user email confirmed?
    emailConfirmed: {
        type: Boolean,
        default: false
    },
    // email confirmation token
    emailConfirmationToken: {
        type: String
    },
    emailConfirmationExpires: {
        type: Date
    },

    // suspension
    suspended: {
        type: Boolean,
        default: false
    },
    suspendedUntil: {
        type: Date
    },

    // reset password token
    resetPasswordToken: {
        type: String
    },
    // expiration of password reset token
    resetPasswordExpires: {
        type: Date
    },

    // currently selected player
    selectedPlayer: {
        type: mongoose.Schema.ObjectId,
        ref: "Player"
    },

    // number of failed login attempts
    attempts: {
        type: Number,
        default: 0
    },
    // date of last successful login
    lastLogin: {
        type: Date
    },
    // date of user registration
    created: {
        type: Date,
        default: moment().toISOString()
    },

    // permissions
    admin: {
        type: Boolean
    },
    mod: {
        type: Boolean
    }
});

// Define our indexes
userSchema.index({
    username: "text",
    email: "text"
});

// https://github.com/saintedlama/passport-local-mongoose
// configure passport-local-mongoose
userSchema.plugin(passportLocalMongoose, {
    usernameField: "email",
    digestAlgorithm: "sha512",
    attemptsField: "attempts",
    lastLoginField: "lastLogin",
    limitAttempts: true,
    maxAttempts: 5
});
userSchema.plugin(mongodbErrorHandler);

// find players where player.user = user._id
userSchema.virtual("players", {
    ref: "Player", // what model to link?
    localField: "_id", // which field on the User?
    foreignField: "user" // which field on the Player?
});

// this might be a bit much?
function autopopulate(next) {
    this.populate("players");
    this.populate("selectedPlayer");
    next();
}
userSchema.pre("find", autopopulate);
userSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("User", userSchema);
