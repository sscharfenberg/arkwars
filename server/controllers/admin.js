/***********************************************************************************************************************
 *
 * userController
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const User = mongoose.model("User");
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node


/*
 * mock show email template ============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 *
 */
exports.showEmail = async (req, res) => {
    const user =  await User.findOne({ email: "ashaltiriak@gmail.com" });
    res.render(`email/${req.params.template}`, {
        user,
        session: req.session,
        confirmURL: "http://localhost:7777/auth/confirm/25d2c65a073d40ebe5c34848f5282862b4d73cec" // does not work.
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
    res.render("admin/index", {
        title: i18n.__("ADMIN.INDEX.TITLE"),
        session: req.session
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
    const users = await User.find({});
    res.render("admin/users", {
        title: i18n.__("ADMIN.USERS.TITLE"),
        session: req.session,
        users
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
