import Vue from "vue";
import Vuex from "vuex";
import actions from "./actions";
import mutations from "./mutations";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        gameId: "123123",
        playerId: "123123",
        textVersion: "500",
        gameData: {}
    },
    getters: {},
    mutations,
    actions
});
