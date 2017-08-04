/***********************************************************************************************************************
 *
 * profileController
 *
 **********************************************************************************************************************/
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node

/*
 * show profile page ===================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showDashboard = (req, res) => {
    res.render("user/dashboard", {
        title: i18n.__("APP.DASHBOARD.TITLE")
    });
};
