/***********************************************************************************************************************
 *
 * Vuex store for area `EMPIRE`
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
        pdus: [],
        shipyards: []
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
        starById: state => id => state.stars.find(star => star.id === id) || {},
        planets: state => state.planets || [],
        planetById: state => id => state.planets.find(planet => planet.id === id) || {},
        harvesters: state => state.harvesters || [],
        harvesterById: state => id => state.harvesters.find( harvester => harvester.id === id) || {},
        pdusByPlanetId: state => id => state.pdus.filter(pdu => pdu.planet === id) || [],
        playerResearches: state => state.researches || [],
        shipyards: state => state.shipyards || [],
        shipyardById: state => id => state.shipyards.find(shipyard => shipyard.id === id) || {}
    },
    mutations,
    actions
});

export default store;
