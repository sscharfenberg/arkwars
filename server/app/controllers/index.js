/***********************************************************************************************************************
 *
 * indexController
 *
 * controller for index (home) page
 *
 * @type {Node.js}
 * @exports {ExpressController} homePage
 *
 **********************************************************************************************************************/

exports.homePage = (req, res) => {
    res.render("index", { title: "Homepage", session: req.session });
};
