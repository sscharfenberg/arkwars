import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        gameId: "123123",
        playerId: "123123",
        textVersion: "500",
        gameData: {}
    },
    getters: {},
    mutations: {
        updateFullGameData: (state, payload) => {
            console.log("committing new game data to store", payload);
            state.gameData = payload;
        }
    },
    actions: {
        FETCH_GAMEDATA_FROM_API: (context) => {
            console.log("fetching game data from api.");
            const payload = {stars:[]};
            context.commit("updateFullGameData", payload);
        }
    }
});
