/******************************************************************************
 * Vuex actions (async)
 *****************************************************************************/
import cfg from "../../config";
import axios from "axios";

const PLAYER_ID = document.getElementById("gameData").getAttribute("data-playerid");
const GAME_ID = document.getElementById("gameData").getAttribute("data-gameid");

console.log(PLAYER_ID, GAME_ID);

const ACTIONS = {

    FETCH_GAMEDATA_FROM_API: (context) => {
        cfg.DEBUG && console.log("fetching game data from api.");
        axios
            .get(`/api/game/${GAME_ID}/player/${PLAYER_ID}/data`)
            .then(response => {
                if (response.status === 200 && response.data) {
                    cfg.DEBUG && console.log("recieved gameData from server: ", response.data);
                    context.commit("updateFullGameData", response.data);
                }
            })
            .catch(error => {
                cfg.DEBUG && console.error(error);
            });

    }

};

export default ACTIONS;
