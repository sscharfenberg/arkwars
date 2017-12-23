/***********************************************************************************************************************
 *
 * userController
 *
 **********************************************************************************************************************/
const chalk = require("chalk"); // https://www.npmjs.com/package/chalk
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const mongoose = require("mongoose"); // http://mongoosejs.com/
const logger = require("../../handlers/logger/console");
const User = mongoose.model("User");
const cfg = require("../../config");

/*
 * switch the language =================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.switchLanguage = async (req, res) => {
    const newLocale = req.params.lang;
    const availableLocales = cfg.app.locales.map(locale => locale.name);
    if (!availableLocales.includes(req.params.lang)) {
        logger.error(`[App] invalid locale: ${chalk.red(newLocale)}.`);
        req.flash("error", i18n.__("APP.LANGUAGE.INVALID"));
        return res.redirect("back");
    }
    req.session.locale = newLocale;
    if (req.user) {
        const user = await User.findOneAndUpdate(
            {_id: req.user._id},
            {$set: {locale: newLocale}},
            {new: true, runValidators: true, context: "query"}
        );
        if (user) {
            logger.info(
                `[App] user ${chalk.red(
                    "@" + user.username
                )} locale updated in db to ${chalk.yellow(req.session.locale)}`
            );
        } else {
            logger.error(
                `[App] error updating database for user ${chalk.red(
                    "@" + user.username
                )} and locale ${chalk.yellow(req.params.lang)}`
            );
        }
    }
    await req.session.save(() => {
        logger.info(
            `[App] user switched locale to ${chalk.yellow(req.session.locale)}`
        );
        return res.redirect("back");
    });
};

/*
 * drawer was opened, update user ======================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.openDrawer = async (req, res) => {
    const user = await User.findOneAndUpdate(
        {_id: req.user._id},
        {
            $set: {
                "settings.drawerOpen": true
            }
        },
        {new: true, runValidators: true, context: "query"}
    );
    if (user) {
        logger.info(
            `[App] user ${chalk.yellow(
                "@" + req.user.username
            )} drawer=${chalk.cyan("open")}.`
        );
        res.json({status: "success"});
    } else {
        logger.error(
            `[App] error updating settings drawer=${chalk.cyan(
                "open"
            )} for user ${chalk.red("@" + user.username)}`
        );
        res.json({status: "error"});
    }
};

/*
 * drawer was opened, update user ======================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.closeDrawer = async (req, res) => {
    const user = await User.findOneAndUpdate(
        {_id: req.user._id},
        {
            $set: {
                "settings.drawerOpen": false
            }
        },
        {new: true, runValidators: true, context: "query"}
    );
    if (user) {
        logger.info(
            `[App] user ${chalk.yellow(
                "@" + req.user.username
            )} drawer=${chalk.red("closed")}.`
        );
        res.json({status: "success"});
    } else {
        logger.error(
            `[App] error updating settings drawer=${chalk.red(
                "closed"
            )} for user ${chalk.red("@" + user.username)}`
        );
        res.json({status: "error"});
    }
};
