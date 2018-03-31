/***********************************************************************************************************************
 *
 * VUEX COMMON STATE
 *
 **********************************************************************************************************************/

export const commonState = {
    // App state
    fetchingGameDataFromApi: false,
    userSettings: {},
    // common game state
    game: {},
    player: {},
    resources: [],
    storageUpgrades: [],
    upgradingStorageLevels: []
};

export const commonGetters = {
    // App state
    fetchingGameDataFromApi: state => state.fetchingGameDataFromApi,
    upgradingStorageLevels: state => state.upgradingStorageLevels,
    userSettings: state => state.userSettings,
    // game state
    game: state => state.game || {},
    player: state => state.player || {},
    playerResources: state => state.resources || [],
    storageUpgrades: state => state.storageUpgrades || []
};
