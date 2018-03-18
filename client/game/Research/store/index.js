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
        changingResearchOrder: false,
        deletingResearchJobs: [],
        // common game state
        game: {},
        player: {},
        resources: [],
        // area game state
        techLevels: [],
        researches: [],
        researchRollBacks: []
    },
    getters: {
        // App state
        fetchingGameDataFromApi: state => state.fetchingGameDataFromApi,
        isChangingResearchOrder: state => state.changingResearchOrder,
        deletingResearchJobs: state => state.deletingResearchJobs || [],
        // common game state
        game: state => state.game || {},
        player: state => state.player || {},
        playerResources: state => state.resources || [],
        // area game state
        playerTechLevels: state => state.techLevels || [],
        playerResearches: state => state.researches || [],
        researchById: state => id => state.researches.find( res => res.id === id) || {}
    },
    mutations,
    actions
});

export default store;
