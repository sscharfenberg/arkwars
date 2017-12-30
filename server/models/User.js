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

const userSchema = new mongoose.Schema(
    {
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
        },

        // user settings
        settings: {
            // main drawer open or not?
            drawerOpen: {
                type: Boolean,
                default: true
            }
        }
    },
    {
        toJSON: {virtuals: true},
        toOjbect: {virtuals: true}
    }
);

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

// find suspensions where suspensions.user = user._id
userSchema.virtual("suspensions", {
    ref: "Suspension", // what model to link?
    localField: "_id", // which field on the User?
    foreignField: "user" // which field on the Player?
});

/*
 * virtual function to find out if the user is suspended
 * @returns {String.ISO8601|false}
 */
userSchema.virtual("isSuspended").get(function() {
    // remove suspensions that are canceled or the until date is in the past.
    let userSuspensions = this.suspensions.filter(
        suspension =>
            !suspension.canceled || moment(suspension.until).diff(moment()) < 0
    );
    if (userSuspensions.length < 1) return false;
    // sort suspensions ascending, so the longest one is the first element
    userSuspensions.sort((a, b) => {
        const diff = moment(a.until).diff(moment(b.until));
        if (diff < 0) return 1;
        if (diff > 0) return -1;
        return 0;
    });
    return userSuspensions.shift().until; // return highest until ISO8601.
});

// this might be a bit much?
function autopopulate(next) {
    this.populate("suspensions");
    this.populate("players");
    this.populate("selectedPlayer");
    next();
}
userSchema.pre("find", autopopulate);
userSchema.pre("findOne", autopopulate);

module.exports = mongoose.model("User", userSchema);
