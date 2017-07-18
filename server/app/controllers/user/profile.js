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
exports.showProfile = (req, res) => {
    res.render("user/profile", {
        title: i18n.__("PAGE_PROFILE_TITLE")
    });
};
