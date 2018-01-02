/***********************************************************************************************************************
 *
 * manageEmailsController
 *
 **********************************************************************************************************************/
const fs = require("fs-extra"); // https://nodejs.org/api/fs.html
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const mongoose = require("mongoose"); // http://mongoosejs.com/
const moment = require("moment"); // https://momentjs.com
const path = require("path"); // https://www.npmjs.com/package/path
const User = mongoose.model("User");
const cfg = require("../../config");

/*
 * mock show email template ============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 * @param {callback} next
 *
 */
exports.showEmail = async (req, res) => {
    const user = await User.findOne({ email: "ashaltiriak@gmail.com" });
    const url = `http://${req.headers.host}/`;
    // add all necessary data options here, since we can't add them dynamically
    const adminEmail = true;
    const admin = {
        username: "Ash"
    };
    const reason = "Just a test reason.";
    const suspendedUntil = moment().add(7, "days").toISOString();
    res.render(`email/${req.params.template}/${req.params.language}`, {
        user,
        session: req.session,
        confirmURL: url,
        adminEmail,
        admin,
        reason,
        suspendedUntil
    });
};

/*
 * show email templates ================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.showEmailTemplates = async (req, res) => {
    const templateSrc = path.join(
        cfg.app.projectDir,
        "server",
        "views",
        "email"
    );
    const emailTemplate = await fs.readdir(templateSrc);
    let templates = emailTemplate.map(name => {
        return {
            name,
            path: path.join(templateSrc, name)
        }
    }).filter(source => fs.lstatSync(source.path).isDirectory());
    res.render("admin/emails", {
        title: i18n.__("ADMIN.EMAILS.TITLE"),
        session: req.session,
        templates
    });
};
