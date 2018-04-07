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

        // area game state
        techLevels: [],
        shipyards: []
    },
    getters: {
        ...commonGetters,
        // App state

        // area game state
        playerTechLevels: state => state.techLevels || [],
        shipyards: state => state.shipyards || []
    },
    mutations,
    actions
});

export default store;
