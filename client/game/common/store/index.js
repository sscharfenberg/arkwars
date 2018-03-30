/***********************************************************************************************************************
 *
 * VUEX COMMON STATE
 *
 **********************************************************************************************************************/

export const commonState = {
    // App state
    fetchingGameDataFromApi: false,
    // common game state
    game: {},
    player: {},
    resources: []
};

export const commonGetters = {
    // App state
    fetchingGameDataFromApi: state => state.fetchingGameDataFromApi,
    // game state
    game: state => state.game || {},
    player: state => state.player || {},
    playerResources: state => state.resources || []
};
