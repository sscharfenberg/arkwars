/***********************************************************************************************************************
 *
 * VUEX STORE
 *
 **********************************************************************************************************************/
import Vue from "vue";
import Vuex from "vuex";
import {getGameId, getPlayerId, getMessagesVersion} from "../handlers/gameConstants";
import actions from "./actions";
import mutations from "./mutations";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        gameId: getGameId(),
        playerId: getPlayerId(),
        serverTextsVersion: getMessagesVersion(),
        gameData: {},
        fetchingGameDataFromApi: false,
        savingStarName: [],
        editingStarName: [],
        installingResourceTypes: []
    },
    getters: {
        fetchingGameDataFromApi: state => state.fetchingGameDataFromApi,
        stars: state => state.gameData.stars || [],
        savingStarNameIds: state => state.savingStarName,
        editingStarNameIds: state => state.editingStarName,
        installingResourceTypes: state => state.installingResourceTypes,
        player: state => state.gameData.player || {},
        planets: state => {
            let planets = [];
            if (!state.gameData.stars) return planets;
            state.gameData.stars.forEach( star => {
                planets = planets.concat(star.planets);
            });
            return planets;
        },
        playerResources: state => state.gameData.resources || [],
        getPlanetById: (state, getters) => id => getters.planets.find(planet => planet.id === id) || {}
    },
    mutations,
    actions
});

export default store;
