/***********************************************************************************************************************
 *
 * VUEX STATE MUTATIONS
 *
 * SYNC!!!
 *
 **********************************************************************************************************************/
import {DEBUG} from "Config";

export const commonMutations = {
    /*
     * SET gameData
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload - game data object from api
     */
    SET_GAME_DATA: (state, payload) => {
        DEBUG && console.log("committing game data to store ", payload);
        // common
        if (payload.game) state.game = payload.game;
        if (payload.player) state.player = payload.player;
        if (payload.resources) state.resources = payload.resources;
        // area = empire
        if (payload.stars) state.stars = payload.stars;
        if (payload.planets) state.planets = payload.planets;
        if (payload.harvesters) state.harvesters = payload.harvesters;
        if (payload.pdus) state.pdus = payload.pdus;
        // area = research
        if (payload.techLevels) state.techLevels = payload.techLevels;
        if (payload.researches) state.researches = payload.researches;
    },

    /*
     * SET/UNSET "Fetching Game Data From Api"
     * @param {Object} state - Vuex $store.state
     * @param {Boolean} payload - true for set, false for unset
     */
    FETCHING_GAME_DATA_FROM_API: (state, payload) => {
        state.fetchingGameDataFromApi = payload;
    }

};
