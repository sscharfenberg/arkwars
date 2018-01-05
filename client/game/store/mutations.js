/******************************************************************************
 * Vuex mutations (sync)
 *****************************************************************************/
const MUTATIONS = {

    updateFullGameData: (state, payload) => {
        console.log("committing new game data to store", payload);
        state.gameData = payload;
    }

};

export default MUTATIONS;
