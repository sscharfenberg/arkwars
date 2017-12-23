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
const cfg = require("../../config");

/*
 * check if user can enlist to this game ===============================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showIndex = async (req, res) => {
    const player = await Player.findOne({
        _id: req.user.selectedPlayer._id
    }).populate("stars");
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

    console.log(player.stars);

    res.render("game/empire", {
        title: "Game Empire",
        session: req.session,
        gameData: {
            textVersion: moment(areaTime).diff(commonTime) > 0 ? areaTime : commonTime
        }
    });
};
