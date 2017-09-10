/***********************************************************************************************************************
 *
 * manageGGamesController
 *
 **********************************************************************************************************************/
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const mongoose = require("mongoose"); // http://mongoosejs.com/
const Game = mongoose.model("Game");

/*
 * show Games ==========================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.showGames = async (req, res) => {
    const games = await Game.find({});
   res.render("admin/games", {
        title: i18n.__("ADMIN.GAMES.TITLE"),
        session: req.session,
        games
    });
};
