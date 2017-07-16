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
const promisify = require("es6-promisify");
const cfg = require("../config");

const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const generateHTML = (filename, options = {}) => {
    const templatePath = path.join(cfg.app.projectDir, "server", "app", "views", "email", `${filename}.pug`);
    const html = pug.renderFile(templatePath, options);
    return juice(html);
};

exports.send = async (options) => {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);

    const mailOptions = {
        from: cfg.app.email.from,
        to: options.user.email,
        subject: options.subject,
        html,
        text
    };
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
};
