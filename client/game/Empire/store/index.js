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
        // UI state
        savingStarName: [],
        editingStarName: [],
        installingResourceTypes: [],
        savingBuildPduPlanets: [],
        savingFoodConsumption: [],
        // common game state
        game: {},
        player: {},
        resources: [],
        // area game state
        stars: [],
        planets: [],
        harvesters: [],
        pdus: []
    },
    getters: {
        // App state
        fetchingGameDataFromApi: state => state.fetchingGameDataFromApi,
        // UI state
        savingStarNameIds: state => state.savingStarName,
        editingStarNameIds: state => state.editingStarName,
        installingResourceTypes: state => state.installingResourceTypes,
        savingBuildPduPlanetIds: state => state.savingBuildPduPlanets,
        savingFoodConsumptionPlanetIds: state => state.savingFoodConsumption,
        // game state
        game: state => state.game || {},
        stars: state => state.stars || [],
        planets: state => state.planets || [],
        player: state => state.player || {},
        harvesters: state => state.harvesters || [],
        playerResources: state => state.resources || [],
        planetById: state => id => state.planets.find(planet => planet.id === id) || {},
        starById: state => id => state.stars.find(star => star.id === id) || {},
        harvesterById: state => id => state.harvesters.find( harvester => harvester.id === id) || {},
        pdusByPlanetId: state => id => state.pdus.filter(pdu => pdu.planet === id) || []
    },
    mutations,
    actions
});

export default store;
