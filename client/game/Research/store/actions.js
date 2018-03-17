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

const ACTIONS = {
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

    /*
     * fetch game data from api via XHR
     * @param {Object} ctx - Vuex $store context
     * @param {Object} payload - Array of full research objects
     */
    CHANGE_RESEARCH_ORDER: function(ctx, payload) {
        let pos = 0;
        let data = payload.map(res => {
            res.order = pos;
            pos++;
            return res;
        });
        DEBUG && console.log(`requesting change research order ${payload.map(res => `${res.area} TL${res.newLevel}`)}`);
        ctx.commit("IS_CHANGING_ORDER", true);
        ctx.commit("SET_RESEARCHES", data); // we pre-emptively change the state to appear `snappier`
        axios
            .post("/api/game/research/order", data)
            .then(response => {
                if (response.status === 200 && response.data) {
                    ctx.commit("SET_RESEARCHES", response.data);
                }
                ctx.commit("IS_CHANGING_ORDER", false);
            })
            .catch(error => {
                console.error(error);
                ctx.commit("IS_CHANGING_ORDER", false);
            });
    }
};

export default ACTIONS;
