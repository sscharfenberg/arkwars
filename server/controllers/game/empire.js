/***********************************************************************************************************************
 *
 * gameEmpireController
 *
 **********************************************************************************************************************/

/*
 * check if user can enlist to this game ===============================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showIndex = (req, res) => {
    res.render("game/empire", {
        title: "Game Empire",
        session: req.session,
    });
};

