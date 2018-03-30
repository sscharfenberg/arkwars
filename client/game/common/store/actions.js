/***********************************************************************************************************************
 *
 * VUEX ACTIONS
 *
 * ASYNC
 *
 **********************************************************************************************************************/
import axios from "axios";
import {applyServerPulse} from "../../../components/game/time";
import {DEBUG} from "../../../config";

export const commonActions = {

    /*
     * fetch game data from api via XHR
     * @param {Object} ctx - Vuex $store context
     * @param {Object} payload
     * @param {String} payload.area
     */
    SET_INITIAL_STATE: function(ctx, payload) {
        DEBUG && console.log("setting intial state");
        ctx.commit("SET_GAME_DATA", payload);
    },

    /*
     * fetch game data from api via XHR
     * @param {Object} ctx - Vuex $store context
     * @param {Object} payload
     * @param {String} payload.area
     */
    FETCH_GAMEDATA_FROM_API: function(ctx, payload) {
        DEBUG && console.log(`fetching game data from api for area ${payload.area}`);
        ctx.commit("FETCHING_GAME_DATA_FROM_API", true);
        axios
            .get(`/api/game/${payload.area}/data`)
            .then(response => {
                if (response.status === 200 && response.data) {
                    ctx.commit("SET_GAME_DATA", response.data);
                    applyServerPulse(response.data.game);
                }
                ctx.commit("FETCHING_GAME_DATA_FROM_API", false);
            })
            .catch(error => {
                console.error(error);
                ctx.commit("FETCHING_GAME_DATA_FROM_API", false);
            });
    },
};


