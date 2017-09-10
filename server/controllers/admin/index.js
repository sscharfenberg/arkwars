/***********************************************************************************************************************
 *
 * adminController
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const fs = require("fs-extra"); // https://nodejs.org/api/fs.html
const path = require("path"); // https://nodejs.org/api/path.html
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const User = mongoose.model("User");
const Game = mongoose.model("Game");
const cfg = require("../../config");

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

