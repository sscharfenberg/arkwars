/***********************************************************************************************************************
 *
 * VUEX STATE MUTATIONS
 *
 * SYNC!!!
 *
 **********************************************************************************************************************/
import {DEBUG} from "Config";

const MUTATIONS = {
    /*
     * SET gameData
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload - game data object from API
     */
    SET_GAME_DATA: (state, payload) => {
        DEBUG && console.log("committing game data to store ", payload);
        state.game = payload.game;
        state.player = payload.player;
        state.resources = payload.resources;
        state.techLevels = payload.techLevels;
        state.researches = payload.researches;
    },

    /*
     * SET/UNSET "Fetching Game Data From API"
     * @param {Object} state - Vuex $store.state
     * @param {Boolean} payload - true for set, false for unset
     */
    FETCHING_GAME_DATA_FROM_API: (state, payload) => {
        state.fetchingGameDataFromApi = payload;
    },

    /*
     * SET/UNSET "Changing Research Order"
     * @param {Object} state - Vuex $store.state
     * @param {Boolean} payload - true for set, false for unset
     */
    IS_CHANGING_ORDER: (state, payload) => {
        state.changingResearchOrder = payload;
    },

    /*
     * SET researches
     * @param {Object} state - Vuex $store.state
     * @param {Boolean} payload - researches array from API
     */
    SET_RESEARCHES: (state, payload) => {
        state.researches = payload;
    },
};

export default MUTATIONS;
