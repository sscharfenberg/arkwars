/***********************************************************************************************************************
 *
 * indexController
 *
 * controller for index (home) page
 *
 **********************************************************************************************************************/
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node

/*
 * show homepage =======================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.homePage = (req, res) => {
    res.render("index", {
        title: i18n.__("PAGE_INDEX_HEADLINE"),
        session: req.session
    });
};
