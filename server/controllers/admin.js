/***********************************************************************************************************************
 *
 * userController
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const fs = require("fs-extra"); // https://nodejs.org/api/fs.html
const path = require("path"); // https://nodejs.org/api/path.html
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const User = mongoose.model("User");
const Game = mongoose.model("Game");
const cfg = require("../config");

// switch direction for text-sorting by mongodb. this makes more sense for users.
const switchDirection = direction => {
    if (direction === "asc") {
        return "desc";
    } else {
        return "asc";
    }
};

/*
 * mock show email template ============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 *
 */
exports.showEmail = async (req, res) => {
    const user = await User.findOne({ email: "ashaltiriak@gmail.com" });
    res.render(`email/${req.params.template}`, {
        user,
        session: req.session,
        confirmURL:
            "http://localhost:7777/auth/confirm/25d2c65a073d40ebe5c34848f5282862b4d73cec" // does not work.
    });
};

/*
 * show admin dashboard ================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 *
 */
exports.showDashboard = async (req, res) => {
    const templateSrc = path.join(
        cfg.app.projectDir,
        "server",
        "views",
        "email"
    );
    const usersPromise = User.count();
    const gamesPromise = Game.count();
    const emailTemplatePromise = fs.readdir(templateSrc);
    let [games, users, emailTpls] = await Promise.all([
        gamesPromise,
        usersPromise,
        emailTemplatePromise
    ]);
    emailTpls = emailTpls
        .map(name => path.join(templateSrc, name))
        .filter(source => fs.lstatSync(source).isDirectory());

    res.render("admin/index", {
        title: i18n.__("ADMIN.INDEX.TITLE"),
        session: req.session,
        games,
        users,
        emailTemplates: emailTpls.length
    });
};

/*
 * show email templates ================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.showEmailTemplates = async (req, res) => {
    res.render("admin/emails", {
        title: i18n.__("ADMIN.EMAILS.TITLE"),
        session: req.session
    });
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
    let dbSortDirection = "desc"; // default sort direction
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
    // reverse the order for username and email, this makes more sense
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

    const usersPromise = User.find(search).skip(skip).limit(limit).sort(sort);
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
 * edit users ==========================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.showEditUser = async (req, res) => {
    const editUser = await User.findOne({_id: req.params.userid});
    return res.render("admin/user", {
        title: i18n.__("ADMIN.USER.TITLE", editUser.username),
        session: req.session,
        editUser
    });
};

/*
 * show Games ==========================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.showGames = async (req, res) => {
    res.render("admin/games", {
        title: i18n.__("ADMIN.GAMES.TITLE"),
        session: req.session
    });
};
