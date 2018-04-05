/***********************************************************************************************************************
 *
 * MAIL HANDLER
 *
 **********************************************************************************************************************/
const nodemailer = require("nodemailer");
const path = require("path");
const pug = require("pug");
const juice = require("juice");
const htmlToText = require("html-to-text");
const i18n = require("i18n");
const cfg = require("../config");


const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});


/*
 * send mail
 * @param {object} options
 */
const generateHTML = (filename, options = {}) => {
    const locale = options.user.locale || "en";
    const templatePath = path.join(
        cfg.app.projectDir,
        "server",
        "views",
        "email",
        filename,
        `${locale}.pug`
    );
    // pass i18n to pug. no res.locales when we are using pug.renderFile
    options.h = { __: i18n.__ };
    const html = pug.renderFile(templatePath, options);
    return juice(html);
};


/*
 * send mail
 * @param {object} options
 */
exports.send = async options => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);
    const mailOptions = {
        from: cfg.app.email.from,
        to: options.user.email,
        subject: options.subject,
        html,
        text
    };
    await transport.sendMail(mailOptions);
};
