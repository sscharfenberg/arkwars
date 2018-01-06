/***********************************************************************************************************************
 *
 * VUEX MUTATIONS
 *
 * SYNC
 *
 **********************************************************************************************************************/
import cfg from "../../config";

const MUTATIONS = {
    /*
     * SET gameData
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload - game data object from api
     */
    SET_GAME_DATA: (state, payload) => {
        cfg.DEBUG && console.log("committing game data to store", payload);
        state.gameData = payload;
    },

    /*
     * SET/UNSET "Fetching Game Data From Api"
     * @param {Object} state - Vuex $store.state
     * @param {Boolean} payload - true for set, false for unset
     */
    FETCHING_GAME_DATA_FROM_API: (state, payload) => {
        state.fetchingGameDataFromApi = payload;
    },

};

export default MUTATIONS;
