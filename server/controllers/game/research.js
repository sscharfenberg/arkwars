/***********************************************************************************************************************
 *
 * gameResearchController
 *
 **********************************************************************************************************************/
const fs = require("fs"); // https://nodejs.org/api/fs.html
const path = require("path"); // https://nodejs.org/api/path.html
const i18n = require("i18n"); // https://github.com/mashpie/i18n-node
const moment = require("moment"); // https://momentjs.com/
const apiResearchGameDataController = require("../api/gameData/research");
const cfg = require("../../config");

/*
 * show game empire screen =============================================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showIndex = async (req, res) => {
    const pathArea = path.join(cfg.app.projectDir, "client", "lang", req.user.locale, "empire.json");
    const pathCommon = path.join(cfg.app.projectDir, "client", "lang", req.user.locale, "common.json");
    const areaTime = fs.statSync(pathArea).mtime;
    const commonTime = fs.statSync(pathCommon).mtime;
    const gameData = await apiResearchGameDataController.fetch(req.user.selectedPlayer);
    res.render("game/research", {
        title: i18n.__("GAME.RESEARCH.LABEL"),
        session: req.session,
        textVersion: moment(areaTime).diff(commonTime) > 0 ? areaTime : commonTime,
        gameData
    });
};
