/***********************************************************************************************************************
 *
 * profileController
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const crypto = require("crypto"); // https://nodejs.org/api/crypto.html
const del = require("del"); // https://www.npmjs.com/package/del
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const jimp = require("jimp"); // https://www.npmjs.com/package/jimp
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const multer = require("multer"); // https://github.com/expressjs/multer
const path = require("path"); // https://www.npmjs.com/package/path
const uuid = require("uuid"); // https://www.npmjs.com/package/uuid
const strip = require("mongo-sanitize"); // https://www.npmjs.com/package/mongo-sanitize
const User = mongoose.model("User");
const Game = mongoose.model("Game");
const Player = mongoose.model("Player");
const userValidators = require("../../handlers/validators/user");
const logger = require("../../handlers/logger/console");
const mail = require("../../handlers/mail");
const cfg = require("../../config");

/*
 * show profile page ===================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showDashboard = async (req, res) => {
    // User.players gets populated with players object, which includes game id.
    const myGames = req.user.players.map(game => game.game);
    let available = await Game.find({
        canEnlist: true,
        startDate: { $gt: moment().toISOString() },
        _id: { $nin: myGames } // not in my games
    }).populate("players");
    available = available.filter(game => {
        return game.maxPlayers > game.players.length;
    }); // filter full games out
    const myActiveGames = await Game.find({
        _id: { $in: myGames } // not in my games
    }).populate("players");
    let myPlayers = req.user.players;
    myPlayers = myPlayers.map(_player => {
        let player = {
            game: {
                active: _player.game.active,
                startDate: _player.game.startDate,
                number: _player.game.number,
                turn: _player.game.turn,
                maxPlayers: _player.game.maxPlayers,
                turnDuration: _player.game.turnDuration,
                numPlayers: _player.game.players
                    ? _player.game.players.length
                    : 0
            },
            name: _player.name,
            ticker: _player.ticker
        };
        myActiveGames.forEach(function(game) {
            if (game.id === _player.game.id) {
                player.game.numPlayers = game.players.length;
            }
        });
        return player;
    });
    res.render("user/dashboard", {
        title: i18n.__("APP.DASHBOARD.TITLE"),
        session: req.session,
        registered: moment(req.user.created).format("LLLL"),
        email: req.user.email,
        available,
        myPlayers
    });
};

/*
 * validate change email address post request ==========================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateChangeEmail = async (req, res, next) => {
    logger.info(
        `[App] change password post request: ${chalk.red(
            "@" + req.user.username
        )} from ${chalk.yellow(req.user.email)} to ${chalk.yellow(
            req.body.email
        )}`
    );
    // changed email validator
    req = userValidators.changedEmail(req);

    const validatorPromise = req.getValidationResult();
    const emailPromise = userValidators.emailPromise(req);
    const [results, existingEmail] = await Promise.all([
        validatorPromise,
        emailPromise
    ]);
    let errorMap = results.mapped();
    let errorList = results.array();
    console.log(errorList);
    console.log(errorMap);

    // emnail already exists.
    if (existingEmail) {
        const errors = userValidators.emailExists(req);
        errorMap.email = errors;
        errorList.push(errors);
    }

    if (errorList.length) {
        // any errors? redirect back with message
        let errorMessage = errorList[0].msg;
        logger.debug(
            `[${chalk.yellow("@" + req.user.username)}] ${errorMessage}`
        );
        req.flash("error", errorMessage);
        return res.redirect("/dashboard");
    }

    next(); // no errors, proceed to next middleware
};

/*
 * change email address request: update user ===========================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.updateEmail = async (req, res, next) => {
    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $set: {
                email: strip(req.body.email),
                emailConfirmed: false,
                emailConfirmationToken: crypto.randomBytes(20).toString("hex"),
                emailConfirmationExpires: moment().add(1, "hours")
            }
        },
        { new: true, runValidators: true, context: "query" }
    );
    if (user) {
        logger.info(
            `[App] user ${chalk.red(
                "@" + user.username
            )} changed email in db to ${chalk.yellow(user.email)}`
        );
        req._user = user;
        next(); // proceed to next middlewawre
    } else {
        logger.error(
            `[App] error updating email in db for user ${chalk.red(
                "@" + user.username
            )}`
        );
        req.flash("error", i18n.__("APP.DASHBOARD.EMAIL.ERR.DB"));
        return res.redirect("/dashboard");
    }
};

/*
 * change email address request: send 'email updated' with activation link =============================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.sendEmailUpdated = async (req, res) => {
    console.log("send updated email");
    const user = req._user;
    const confirmURL = `http://${req.headers
        .host}/auth/confirm/${user.emailConfirmationToken}`;
    await mail.send({
        user,
        filename: "changed_email",
        subject: i18n.__("APP.DASHBOARD.EMAIL.MAIL_SUBJECT", cfg.app.title),
        confirmURL
    });
    logger.info(
        `[App] sent "email changed" mail to ${chalk.yellow(user.email)}.`
    );
    req.flash("success", i18n.__("APP.DASHBOARD.EMAIL.SUCCESS"));
    req.logout();
    res.redirect("/auth/login");
};

/*
 * validate change email address post request ==========================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateChangePassword = async (req, res, next) => {
    logger.info(
        `[App] change password post request: ${chalk.red(
            "@" + req.user.username
        )} from ${chalk.yellow(req.user.email)} to ${chalk.yellow(
            req.body.email
        )}`
    );
    // changed password validator
    req = userValidators.changedPassword(req);
    const validationResults = await req.getValidationResult();

    if (validationResults.array().length) {
        let errorMessage = validationResults.array()[0].msg;
        logger.debug(
            `[${chalk.yellow("@" + req.user.username)}] ${errorMessage}`
        );
        req.flash("error", errorMessage);
        return res.redirect("/dashboard");
    }

    next(); // no errors, proceed to next middleware
};

/*
 * update password request =============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.updatePassword = async (req, res) => {
    const user = req.user;
    await user.setPassword(req.body.password);
    await user.save(); // save to db
    logger.info(
        `[App] user ${chalk.red("@" + user.username)} changed password.`
    );
    req.flash("success", i18n.__("APP.DASHBOARD.PWD.SUCCESS"));
    res.redirect("/dashboard");
};

/*
 * Multer middleware - buffer multipart/form-data fields into req.file =================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.bufferAvatarFormData = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // go above this and we get a 500.
    },
    fileFilter(req, file, next) {
        let allowed = cfg.app.avatar.mimeTypes;
        // needs to be an image, must not be gif
        if (allowed.includes(file.mimetype)) {
            next(null, true); // keep the file
        } else {
            req._fileError = i18n.__(
                "APP.DASHBOARD.AVATAR.ERR.TypeNotAllowed",
                allowed.join(", ")
            );
            next(null, false); // discard the file
        }
    }
}).single("avatar");

/*
 * validate avatar =====================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.validateAvatar = async (req, res, next) => {
    if (!req.file) {
        if (req._fileError) {
            req.flash("error", req._fileError);
            logger.debug(
                `[App] ${chalk.red(
                    "@" + req.user.username
                )}'s new avatar is wrong mime type.`
            );
        } else {
            req.flash("error", i18n.__("APP.DASHBOARD.AVATAR.ERR.Empty"));
        }
        return res.redirect("/dashboard");
    }

    let sizeDiff = Math.round(
        (req.file.size - cfg.app.avatar.maxFileSize) / 1024
    );
    let diffText = sizeDiff.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // add decimal mark
    logger.info(
        `[App] change avatar request from ${chalk.red("@" + req.user.username)}`
    );

    if (req.file && sizeDiff > 0) {
        req.flash(
            "error",
            i18n.__("APP.DASHBOARD.AVATAR.ERR.FileSize", diffText)
        );
        logger.debug(
            `[App] ${chalk.red(
                "@" + req.user.username
            )}'s new avatar is ${diffText} Kb too big.`
        );
        req.file = undefined; // discard the image
        return res.redirect("/dashboard");
    }

    next(); // file is not too big, and valid mime type
};

/*
 * write avatar to disk ================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.writeAvatar = async (req, res, next) => {
    const extension = req.file.mimetype.split("/").pop();
    const image = await jimp.read(req.file.buffer);
    const filename = `${uuid.v4()}.${extension}`;
    const filepath = path.join(cfg.app.avatar.path, filename);
    if (
        image.bitmap.width > cfg.app.avatar.maxSize.width ||
        image.bitmap.height > cfg.app.avatar.maxSize.height
    ) {
        await image.resize(
            cfg.app.avatar.maxSize.width,
            cfg.app.avatar.maxSize.height
        );
    }
    req._avatar = filename;
    await image.write(filepath);
    logger.info(
        `[App] avatar for ${chalk.red(
            "@" + req.user.username
        )} written to disk.`
    );
    next();
};

/*
 * delete old avatar ===================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 */
exports.deleteOldAvatar = async (req, res, next) => {
    if (req.user.avatar) {
        const filepath = path.join(cfg.app.avatar.path, req.user.avatar);
        await del(filepath);
        logger.info(`[App] deleted old avatar ${req.user.avatar}`);
    }
    next();
};

/*
 * update user =========================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.updateAvatarUser = async (req, res) => {
    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $set: {
                avatar: req._avatar
            }
        },
        { new: true, runValidators: true, context: "query" }
    );
    if (!user) {
        await del(path.join(cfg.app.avatar.path, req._avatar));
        logger.error(`[App] error updating db with new avatar, rolled back.`);
        req.flash("error", i18n.__("APP.DASHBOARD.AVATAR.ERR.DbFail"));
    } else {
        logger.debug(
            `[App] avatar for user ${chalk.red("@" + user.username)} updated.`
        );
        req._avatar = undefined;
        req.user = user;
        req.flash("success", i18n.__("APP.DASHBOARD.AVATAR.SUCCESS"));
    }
    res.redirect("/dashboard");
};

/*
 * delete old avatar ===================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.deleteCurrentAvatar = async (req, res) => {
    const filepath = path.join(cfg.app.avatar.path, req.user.avatar);
    await del(filepath);
    await User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $set: {
                avatar: undefined
            }
        },
        { new: true, runValidators: true, context: "query" }
    );
    logger.info(
        `[App] deleted current avatar of ${chalk.red("@" + req.user.username)}`
    );
    req.flash("success", i18n.__("APP.DASHBOARD.AVATAR.DELETED"));
    res.redirect("/dashboard");
};

/*
 * delete user account =================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.deleteUser = async (req, res) => {
    const deletedUser = await User.findOneAndRemove({
        _id: req.user._id
    });
    if (deletedUser) {
        await Player.findOneAndRemove({
            user: req.user._id
        });
        logger.debug(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} has deleted his account`
        );
        req.logout();
        req.flash("success", i18n.__("APP.DASHBOARD.INFOBOX.DELETE.SUCCESS"));
        res.redirect("/");
    } else {
        req.flash("success", i18n.__("APP.DASHBOARD.INFOBOX.DELETE.FAILED"));
        logger.error(
            `[App] user ${chalk.red(
                "@" + req.user.username
            )} account deletion failed`
        );
        res.redirect("back");
    }
};
