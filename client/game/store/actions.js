/***********************************************************************************************************************
 *
 * VUEX ACTIONS
 * ASYNC
 *
 **********************************************************************************************************************/
import axios from "axios";
import cfg from "../../config";
//import {getAreaMessages} from "../handlers/texts";
import {getGameId, getPlayerId} from "../handlers/gameConstants";

/*
 * STORE ACTIONS =======================================================================================================
 */
const ACTIONS = {
    FETCH_GAMEDATA_FROM_API: function(context) {
        cfg.DEBUG && console.log("fetching game data from api.");
        axios
            .get(`/api/game/${getGameId()}/player/${getPlayerId()}/data`)
            .then(response => {
                if (response.status === 200 && response.data) {
                    context.commit("SET_GAME_DATA", response.data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
};

export default ACTIONS;
