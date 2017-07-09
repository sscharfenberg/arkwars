/***********************************************************************************************************************
 *
 * apiController
 *
 * @exports {ExpressController} pulse
 *
 **********************************************************************************************************************/
const moment = require("moment");

/*
 * `pulse` - server returns generic game-data
 * @returns:
 * {string} serverTime
 * {int} game number
 * {int} current turn
 * {string} time of next turn
 */
exports.pulse = async (req, res) => {
    let game = req.params.game || 0;
    let now = moment();

    res.json({
        serverTime: now.toISOString()
        , game
        , turn: {
            duration: 15
            , currentNumber: 21
            , nextTime: now.add(10, "minutes").toISOString()
        }
    });
};
