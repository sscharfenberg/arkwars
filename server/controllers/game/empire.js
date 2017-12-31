/***********************************************************************************************************************
 *
 * gameEmpireController
 *
 **********************************************************************************************************************/
const fs = require("fs"); // https://nodejs.org/api/fs.html
const path = require("path"); // https://nodejs.org/api/path.html
const mongoose = require("mongoose"); // http://mongoosejs.com/
const moment = require("moment"); // https://momentjs.com/
const Player = mongoose.model("Player");
const Game = mongoose.model("Game");
const cfg = require("../../config");

/*
 * show game empire screen =============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showIndex = async (req, res) => {
    const game = await Game.findOne({number: req.params.game});
    const player = await Player.findOne({
        game: game._id,
        user: req.user._id
    }).populate("stars");
    //console.log("Player: ", player);
    //console.log("Suspensions", req.user.suspensions)
    const pathArea = path.join(
        cfg.app.projectDir,
        "client",
        "lang",
        req.user.locale,
        "empire.json"
    );
    const pathCommon = path.join(
        cfg.app.projectDir,
        "client",
        "lang",
        req.user.locale,
        "common.json"
    );
    const areaTime = fs.statSync(pathArea).mtime;
    const commonTime = fs.statSync(pathCommon).mtime;

    //console.log("stars: ", player.stars);

    res.render("game/empire", {
        title: "Game Empire",
        session: req.session,
        textVersion:
            moment(areaTime).diff(commonTime) > 0 ? areaTime : commonTime,
        gameData: {}
    });
};
