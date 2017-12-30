/***********************************************************************************************************************
 *
 * authorizedValidators
 * @type {NodeJS}
 *
 **********************************************************************************************************************/
//const moment = require("moment"); // https://momentjs.com/
//const mongoose = require("mongoose"); // http://mongoosejs.com/
//const User = mongoose.model("User");

/*
 * does the request come from a logged in user?
 * @param {ExpressHTTPRequest} req
 * @returns {Boolean}
 */
const isUserLoggedIn = req => {
    return req.isAuthenticated();
};

/*
 * does the user have a player in this game?
 * @param {String} gameNumber
 * @param {Array} userGames
 */
const userHasPlayerInGame = (gameId, userGameIds) => {
    if (typeof userGameIds !== "object") return false;
    if (typeof gameId !== "string") return false;
    return userGameIds.includes(gameId);
};

module.exports = {isUserLoggedIn, userHasPlayerInGame};
