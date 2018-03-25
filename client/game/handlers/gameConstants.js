/***********************************************************************************************************************
 *
 * get variables that don't change during app lifetime
 * the values for these are stored as data-attributes in #gameData
 *
 **********************************************************************************************************************/
import moment from "moment/moment";

const getPlayerId = () => document.getElementById("gameData").getAttribute("data-playerid");
const getGameId = () => document.getElementById("gameData").getAttribute("data-gameid");
const getLocale = () => document.getElementById("gameData").getAttribute("data-locale");
const getMessagesVersion = () =>
    document.getElementById("gameData").getAttribute("data-textversion") ||
    moment()
        .add(99, "years")
        .toISOString();
const getAreaSlug = () => document.getElementById("gameData").getAttribute("data-area");
const getInitialState = () => JSON.parse(document.getElementById("gameData").getAttribute("data-initial"));

export {getPlayerId, getGameId, getLocale, getMessagesVersion, getAreaSlug, getInitialState};
