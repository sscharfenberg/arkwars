/***********************************************************************************************************************
 *
 * VUEX ACTIONS
 *
 * ASYNC
 *
 **********************************************************************************************************************/
import axios from "axios";
import cfg from "../../config";
import {getGameId, getPlayerId} from "../handlers/gameConstants";

/*
 * STORE ACTIONS =======================================================================================================
 */
const ACTIONS = {
    /*
     * fetch game data from api via XHR
     * @param {Object} ctx - VueJS context
     */
    FETCH_GAMEDATA_FROM_API: function(ctx) {
        cfg.DEBUG && console.log("fetching game data from api.");
        ctx.commit("FETCHING_GAME_DATA_FROM_API", true);
        axios
            .get(`/api/game/${getGameId()}/player/${getPlayerId()}/data`)
            .then(response => {
                if (response.status === 200 && response.data) {
                    ctx.commit("SET_GAME_DATA", response.data);
                }
                ctx.commit("FETCHING_GAME_DATA_FROM_API", false);
            })
            .catch(error => {
                console.error(error);
                ctx.commit("FETCHING_GAME_DATA_FROM_API", false);
            });
    }
};

export default ACTIONS;
