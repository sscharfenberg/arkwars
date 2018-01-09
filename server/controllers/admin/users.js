/***********************************************************************************************************************
 *
 * manageUsersController
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const crypto = require("crypto"); // https://nodejs.org/api/crypto.html
const del = require("del"); // https://www.npmjs.com/package/del
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const moment = require("moment"); // https://momentjs.com/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const path = require("path"); // https://www.npmjs.com/package/path
const strip = require("mongo-sanitize"); // https://www.npmjs.com/package/mongo-sanitize
const User = mongoose.model("User");
const Suspension = mongoose.model("Suspension");
const mail = require("../../handlers/mail");
const logger = require("../../handlers/logger/console");
const cfg = require("../../config");

/*
 * switch direction for text-sorting by mongodb. this makes more sense for users. ======================================
 * @param {String} direction
 *
 */
const switchDirection = direction => {
    if (direction === "asc") {
        return "desc";
    } else {
        return "asc";
    }
};

/*
 * show users ==========================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.showUsers = async (req, res) => {
    const page = parseInt(req.params.page, 10) || 1; // current page
    let sort = {}; // temp sort.
    let sortField = "created"; // default sort column
    let sortDirection = "desc"; // default sort direction
    let dbSortDirection = "desc"; // default sort direction for mongoose
    let search = {};
    let limit = cfg.defaultPagination.admin.users; // number of users per page
    let skip = page * limit - limit; // skip entries if we are not on page 1
    let data = req.body;

    if (req.body.username) search.username = new RegExp(req.body.username, "i");
    if (req.body.email) search.email = new RegExp(req.body.email, "i");
    if (req.body.sort) {
        sortField = req.body.sort.split("_")[0];
        sortDirection = dbSortDirection = req.body.sort.split("_")[1];
    }

    // if no post params exist, try and use url params (pagination links!)
    if (req.params.sortField && req.params.sortDirection) {
        sortField = req.params.sortField;
        sortDirection = dbSortDirection = req.params.sortDirection;
    }
    // reverse the order for username and email, this makes more sense since we expect A to come first @ sort_desc
    if (sortField === "username" || sortField === "email") {
        dbSortDirection = switchDirection(sortDirection);
    }
    // if we have search params, do not use skip and limit
    if (req.body.username || req.body.email) {
        limit = 0;
        skip = 0;
    }

    sort[sortField] = dbSortDirection; // object notation for mongoose
    data.sort = `${sortField}_${sortDirection}`; // pass to pug as value of input[name=sort]

    const usersPromise = User.find(search)
        .sort(sort)
        .skip(skip)
        .limit(limit);
    const countPromise = User.find(search);
    const [users, count] = await Promise.all([usersPromise, countPromise]);
    const pages = Math.ceil(count.length / limit);

    if (!count && skip) {
        req.flash(
            "info",
            `Hey! You asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`
        );
        res.redirect(`/admin/users/p/${pages}`);
        return;
    }
    res.render("admin/users", {
        title: i18n.__("ADMIN.USERS.TITLE"),
        session: req.session,
        users,
        page,
        pages,
        count: count.length,
        data,
        sortField,
        sortDirection
    });
};

/*
 * show edit users form ================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.showEditUser = async (req, res) => {
    const editUser = await User.findOne({_id: req.params.userid});
    if (!editUser) {
        req.flash(
            "error",
            i18n.__("ADMIN.USER.ERROR.UserNotFound", req.params.userid)
        );
        return res.redirect("/admin/users");
    }
    if (editUser.suspensions.length > 0 && editUser.isSuspended) {
        const adminUsers = await User.find({admin: true});
        const admins = adminUsers.map(admin => {
            return {
                id: admin.id,
                username: admin.username
            };
        });
        editUser.suspensions = editUser.suspensions.map(suspension => {
            return {
                id: suspension.id,
                until: suspension.until,
                /* admin and suspension IDs are properties of the mongoose model and reference
                 * MongoDB ObjectIds - they are object-like, not Strings.
                 * In order to use strict equality === we need to convert these object-likes to strings
                 * Javascript, the weird parts (tm) */
                by: admins
                    .filter(admin => `${admin.id}` === `${suspension.by}`)
                    .shift().username,
                canceled: suspension.canceled,
                dateSuspended: suspension.dateSuspended,
                reason: suspension.reason
            };
        });
    }
    return res.render("admin/user", {
        title: i18n.__("ADMIN.USER.TITLE", editUser.username),
        session: req.session,
        editUser,
        userId: req.params.userid
    });
};

/*
 * change username =====================================================================================================
 * TODO: add validators since we might have malicious admins?
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.changeUsername = async (req, res) => {
    const editedUser = await User.findOneAndUpdate(
        {_id: req.params.userid},
        {
            $set: {
                username: strip(req.body.username)
            }
        },
        {new: true, runValidators: true, context: "query"}
    );
    logger.success(
        `[Admin ${chalk.cyan(
            "@" + req.user.username
        )}]: changed username of ObjectId ${chalk.red(
            editedUser.id
        )} to ${chalk.yellow(editedUser.username)}`
    );
    req.flash(
        "success",
        i18n.__("ADMIN.USER.SUCCESS.USERNAME", editedUser.username)
    );
    return res.redirect("back");
};

/*
 * change email ========================================================================================================
 * TODO: add validators since we might have malicious admins?
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.changeEmail = async (req, res) => {
    const editedUser = await User.findOneAndUpdate(
        {_id: req.params.userid},
        {$set: {email: strip(req.body.email)}},
        {new: true, runValidators: true, context: "query"}
    );
    logger.success(
        `[Admin ${chalk.cyan(
            "@" + req.user.username
        )}]: changed email of ObjectId ${chalk.red(
            editedUser.id
        )} to ${chalk.yellow(editedUser.email)}`
    );
    req.flash("success", i18n.__("ADMIN.USER.SUCCESS.EMAIL", editedUser.email));
    return res.redirect("back");
};

/*
 * reset avatar ========================================================================================================
 * TODO: add validators since we might have malicious admins?
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.resetAvatar = async (req, res) => {
    // make sure we don't try to delete "undefined"
    if (!req.body.currAvatarUrl || req.body.currAvatarUrl === "") {
        req.flash("error", i18n.__("ADMIN.USER.ERROR.NoAvatarToReset"));
        return res.redirect("back");
    }
    const filepath = path.join(cfg.app.avatar.path, req.body.currAvatarUrl);
    await del(filepath);
    logger.info(`[App] deleted old avatar ${req.body.currAvatarUrl}`);
    const editedUser = await User.findOneAndUpdate(
        {_id: strip(req.params.userid)},
        {$set: {avatar: undefined}},
        {new: true, runValidators: true, context: "query"}
    );
    logger.success(
        `[Admin ${chalk.cyan(
            "@" + req.user.username
        )}]: reset avatar of ObjectId ${chalk.red(
            editedUser.id
        )} (${chalk.yellow("@" + editedUser.username)}).`
    );
    req.flash(
        "success",
        i18n.__("ADMIN.USER.SUCCESS.AVATAR", editedUser.email)
    );
    return res.redirect("back");
};

/*
 * suspend user ========================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.suspendUser = async (req, res) => {
    if (!req.body.duration || req.body.duration === "") {
        req.flash("error", i18n.__("ADMIN.USER.ERROR.SuspensionNoDuration"));
        return res.redirect("back");
    }
    // moment.add needs {Number}, {string}
    const duration = req.body.duration.split("_");
    const suspendUntil = moment().add(parseInt(duration[0], 10), duration[1]);
    const suspendedUser = await User.findOne({_id: req.params.userid});
    const suspension = await new Suspension({
        user: req.params.userid,
        by: req.user._id,
        until: suspendUntil,
        reason: req.body.reason
    }).save();
    if (suspension && suspendedUser) {
        logger.success(
            `[Admin ${chalk.cyan(
                "@" + req.user.username
            )}]: suspended user ${chalk.red("@" + suspendedUser.username)} for ${
                req.body.duration
            } until ${chalk.yellow(suspendUntil.format("LL"))}.`
        );
        await mail.send({
            user: suspendedUser,
            filename: "suspend_user",
            subject: i18n.__(
                {
                    phrase: "ADMIN.USER.SUSPEND.MAIL_SUBJECT",
                    locale: suspendedUser.locale
                }
            ) + `${suspension._id}`,
            reason: req.body.reason,
            suspendedUntil: `${moment(suspendUntil).format("LLLL")} (${moment(suspendUntil).fromNow()})`,
            admin: req.user
        });

        req.flash(
            "success",
            i18n.__("ADMIN.USER.SUCCESS.SUSPENSION", suspendUntil.format("LL"))
        );
    }
    return res.redirect("back");
};

/*
 * clear user suspension ===============================================================================================
  * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.clearUserSuspension = async (req, res) => {
    const suspendedUser = await User.findOne({_id: req.params.userid});
    const canceledSuspension = await Suspension.findOneAndUpdate(
        {_id: req.params.suspensionid, user: req.params.userid},
        {$set: {canceled: true}},
        {new: true, runValidators: true, context: "query"}
    );
    if (canceledSuspension && suspendedUser) {
        logger.success(
            `[Admin ${chalk.cyan(
                "@" + req.user.username
            )}]: cleared suspension of user ${chalk.red(
                "@" + suspendedUser.username
            )}.`
        );
        await mail.send({
            user: suspendedUser,
            filename: "clear_user_suspension",
            subject: i18n.__(
                {
                    phrase: "ADMIN.USER.SUSPEND.CLEAR_MAIL_SUBJECT",
                    locale: suspendedUser.locale
                }
            ) + `${canceledSuspension._id}`,
            admin: req.user
        });
        req.flash(
            "success",
            i18n.__(
                "ADMIN.USER.SUCCESS.CLEARSUSPENSION",
                suspendedUser.username
            )
        );
    }
    return res.redirect("back");
};

/*
 * reset password ======================================================================================================
 * TODO: add validators since we might have malicious admins?
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.resetPassword = async (req, res) => {
    const editedUser = await User.findOneAndUpdate(
        {_id: req.params.userid},
        {
            $set: {
                resetPasswordToken: crypto.randomBytes(20).toString("hex"),
                resetPasswordExpires: moment().add(1, "hours")
            }
        },
        {new: true, runValidators: true, context: "query"}
    );
    if (!editedUser) {
        req.flash(
            "error",
            i18n.__("ADMIN.USER.ERROR.UserNotFound", req.params.userid)
        );
        return res.redirect("back");
    }
    const confirmURL = `http://${req.headers.host}/auth/reset/${
        editedUser.resetPasswordToken
    }`;
    await mail.send({
        user: editedUser,
        filename: "reset_email",
        subject: i18n.__(
            {
                phrase: "APP.RESET.MAIL_SUBJECT",
                locale: editedUser.locale
            },
            cfg.app.title
        ),
        confirmURL,
        adminEmail: true
    });
    logger.info(
        `[Admin ${chalk.cyan(
            "@" + req.user.username
        )}] sent reset email to ${chalk.yellow(editedUser.email)}.`
    );
    req.flash(
        "success",
        i18n.__("ADMIN.USER.SUCCESS.PASSWORD", editedUser.username)
    );
    res.redirect("back");
};

/*
 * resend confirmation email ===========================================================================================
 * TODO: add validators since we might have malicious admins?
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.resendConfirmationEmail = async (req, res) => {
    const editedUser = await User.findOneAndUpdate(
        {_id: req.params.userid},
        {
            $set: {
                emailConfirmationToken: crypto.randomBytes(20).toString("hex"),
                emailConfirmationExpires: moment().add(1, "hours")
            }
        },
        {new: true, runValidators: true, context: "query"}
    );
    const confirmURL = `http://${req.headers.host}/auth/confirm/${
        editedUser.emailConfirmationToken
    }`;
    editedUser &&
        (await mail.send({
            user: editedUser,
            filename: "resend_email",
            subject: i18n.__(
                {
                    phrase: "APP.RESEND.MAIL_SUBJECT",
                    locale: editedUser.locale
                },
                cfg.app.title
            ),
            confirmURL,
            adminEmail: true
        }));
    logger.info(
        `[Admin ${chalk.cyan(
            "@" + req.user.username
        )}] re-sent activation email to ${chalk.yellow(
            editedUser.email
        )} and updated user with new confirm token.`
    );
    req.flash(
        "success",
        i18n.__("ADMIN.USER.SUCCESS.EMAILCONFIRMATION", editedUser.username)
    );
    return res.redirect("back");
};

/*
 * set email address to confirmed ======================================================================================
 * TODO: add validators since we might have malicious admins?
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.setEmailConfirmed = async (req, res) => {
    const editedUser = await User.findOneAndUpdate(
        {_id: req.params.userid},
        {
            $set: {
                emailConfirmationToken: undefined,
                emailConfirmationExpires: undefined,
                emailConfirmed: true
            }
        },
        {new: true, runValidators: true, context: "query"}
    );
    logger.info(
        `[Admin ${chalk.cyan(
            "@" + req.user.username
        )}] re-sent activation email to ${chalk.yellow(
            editedUser.email
        )} and updated user with new confirm token.`
    );
    req.flash(
        "success",
        i18n.__("ADMIN.USER.SUCCESS.EMAILCONFIRM", editedUser.username)
    );
    return res.redirect("back");
};
