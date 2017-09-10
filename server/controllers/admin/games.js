/***********************************************************************************************************************
 *
 * manageGGamesController
 *
 **********************************************************************************************************************/
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const mongoose = require("mongoose"); // http://mongoosejs.com/
const Game = mongoose.model("Game");
const cfg = require("../../config");

/*
 * show Games ==========================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.showGames = async (req, res) => {
    const page = parseInt(req.params.page, 10) || 1; // current page
    let sort = {}; // temp sort.
    let sortField = "startDate"; // default sort column
    let sortDirection = "desc"; // default sort direction
    let limit = cfg.defaultPagination.admin.games; // number of users per page
    let skip = page * limit - limit; // skip entries if we are not on page 1
    let data = req.body;
    if (req.body.sort) {
        sortField = req.body.sort.split("_")[0];
        sortDirection = req.body.sort.split("_")[1];
    }
    // if no post params exist, try and use url params (pagination links!)
    if (req.params.sortField && req.params.sortDirection) {
        sortField = req.params.sortField;
        sortDirection = req.params.sortDirection;
    }
    sort[sortField] = sortDirection; // object notation for mongoose
    data.sort = `${sortField}_${sortDirection}`; // pass to pug as value of input[name=sort]

    const gamesPromise = Game.find({})
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("players");
    const countPromise = Game.find({});
    const [games, count] = await Promise.all([gamesPromise, countPromise]);
    const pages = Math.ceil(count.length / limit);

    res.render("admin/games", {
        title: i18n.__("ADMIN.GAMES.TITLE"),
        session: req.session,
        games,
        page,
        pages,
        count: count.length,
        data,
        sortField,
        sortDirection
    });
};

/*
 * show Games ==========================================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 *
 */
exports.showEditGame = async (req, res) => {
    let game = {};
    let title = i18n.__("ADMIN.GAME.TITLENEW");
    if (req.params.id) {
        game = await Game.findOne({ _id: req.params.id });
        title = i18n.__("ADMIN.GAME.TITLE", game.number);
    }
    res.render("admin/game", {
        session: req.session,
        title,
        game
    });
};
