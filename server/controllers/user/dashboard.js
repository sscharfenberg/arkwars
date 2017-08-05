/***********************************************************************************************************************
 *
 * profileController
 *
 **********************************************************************************************************************/
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const moment = require("moment"); // https://momentjs.com/

/*
 * show profile page ===================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showDashboard = (req, res) => {
    moment.locale(req.session.locale);
    res.render("user/dashboard", {
        title: i18n.__("APP.DASHBOARD.TITLE"),
        registered: moment(req.user.created).format("LLLL")
    });
};
