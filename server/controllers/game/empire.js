/***********************************************************************************************************************
 *
 * gameEmpireController
 *
 **********************************************************************************************************************/
const mongoose = require("mongoose"); // http://mongoosejs.com/
const Player = mongoose.model("Player");

/*
 * check if user can enlist to this game ===============================================================================
 * @param {ExpressHTTPRequest} req
 * @param {ExpressHTTPResponse} res
 */
exports.showIndex = async (req, res) => {
    const player = await Player.findOne({_id: req.user.selectedPlayer._id}).populate("stars");
    console.log(player.stars);

    res.render("game/empire", {
        title: "Game Empire",
        session: req.session,
    });
};

