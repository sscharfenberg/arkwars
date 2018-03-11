/***********************************************************************************************************************
 *
 * VUEX STORE
 *
 **********************************************************************************************************************/
import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        // App state
        fetchingGameDataFromApi: false,
        // common game state
        game: {},
        player: {},
        resources: [],
        // area game state
        techLevels: [],
        researches: []
    },
    getters: {
        // App state
        fetchingGameDataFromApi: state => state.fetchingGameDataFromApi,
        // common game state
        game: state => state.game || {},
        player: state => state.player || {},
        playerResources: state => state.resources || [],
        // area game state
        playerTechLevels: state => state.techLevels || [],
        playerResearches: state => state.researches || []
    },
    mutations,
    actions
});

export default store;
