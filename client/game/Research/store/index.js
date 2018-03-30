/***********************************************************************************************************************
 *
 * VUEX STORE
 *
 **********************************************************************************************************************/
import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";
import {commonState, commonGetters} from "../../common/store/";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        ...commonState,
        // App state
        changingResearchOrder: false,
        changingResearchPriority: false,
        deletingResearchJobs: [],
        startingResearchJobs: [],
        // area game state
        techLevels: [],
        researches: [],
        researchRollBacks: []
    },
    getters: {
        ...commonGetters,
        // App state
        isChangingResearchOrder: state => state.changingResearchOrder,
        isChangingResearchPriority: state => state.changingResearchPriority,
        deletingResearchJobs: state => state.deletingResearchJobs || [],
        startingResearchJobs: state => state.startingResearchJobs || [],
        // area game state
        playerTechLevels: state => state.techLevels || [],
        playerResearches: state => state.researches || [],
        researchById: state => id => state.researches.find( res => res.id === id) || {}
    },
    mutations,
    actions
});

export default store;
