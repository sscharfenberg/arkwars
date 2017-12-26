/***********************************************************************************************************************
 *
 * authorizedValidators
 * @type {NodeJS}
 *
 **********************************************************************************************************************/
const moment = require("moment"); // https://momentjs.com/

/*
 * does the request come from a logged in user?
 * @param {ExpressHTTPRequest} req
 * @returns {Boolean}
 */
const isUserLoggedIn = req => {
    return req.isAuthenticated();
};

/*
 * is the current user suspended?
 * @param {Boolean} suspended
 * @param {String.ISO8601} suspendedUntil
 * @returns {Boolean}
 */
const isUserSuspended = (suspended, suspendedUntil) => {
    return suspended && moment(suspendedUntil).diff(moment()) > 0;
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

module.exports = {isUserLoggedIn, isUserSuspended, userHasPlayerInGame};
