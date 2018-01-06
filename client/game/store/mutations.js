/***********************************************************************************************************************
 *
 * VUEX MUTATIONS
 * SYNC
 *
 **********************************************************************************************************************/
import cfg from "../../config";

const MUTATIONS = {

    SET_GAME_DATA: (state, payload) => {
        cfg.DEBUG && console.log("committing new game data to store", payload);
        state.gameData = payload;
    }

};

export default MUTATIONS;
