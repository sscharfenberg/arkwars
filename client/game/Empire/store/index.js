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
        savingStarName: [],
        editingStarName: [],
        installingResourceTypes: [],
        savingBuildPduPlanets: [],
        savingFoodConsumption: [],
        // area game state
        stars: [],
        planets: [],
        harvesters: [],
        researches: [],
        pdus: []
    },
    getters: {
        ...commonGetters,
        // App state
        savingStarNameIds: state => state.savingStarName,
        editingStarNameIds: state => state.editingStarName,
        installingResourceTypes: state => state.installingResourceTypes,
        savingBuildPduPlanetIds: state => state.savingBuildPduPlanets,
        savingFoodConsumptionPlanetIds: state => state.savingFoodConsumption,
        // area game state
        stars: state => state.stars || [],
        planets: state => state.planets || [],
        harvesters: state => state.harvesters || [],
        planetById: state => id => state.planets.find(planet => planet.id === id) || {},
        starById: state => id => state.stars.find(star => star.id === id) || {},
        playerResearches: state => state.researches || [],
        harvesterById: state => id => state.harvesters.find( harvester => harvester.id === id) || {},
        pdusByPlanetId: state => id => state.pdus.filter(pdu => pdu.planet === id) || []
    },
    mutations,
    actions
});

export default store;
