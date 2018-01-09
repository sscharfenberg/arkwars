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
        editingStarName: []
    },
    getters: {
        fetchingGameDataFromApi: state => {
            return state.fetchingGameDataFromApi;
        },
        stars: state => {
            return state.gameData.stars || [];
        },
        savingStarNameIds: state => {
            return state.savingStarName;
        },
        editingStarNameIds: state => {
            return state.editingStarName;
        }
    },
    mutations,
    actions
});

export default store;
