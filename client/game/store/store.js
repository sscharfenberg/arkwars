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
        fetchingGameDataFromApi: false
    },
    getters: {
        fetchingGameDataFromApi: state => {
            return state.fetchingGameDataFromApi;
        }
    },
    mutations,
    actions
});

export default store;
