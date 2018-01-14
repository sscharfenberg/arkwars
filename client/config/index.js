/** ********************************************************************************************************************
 *
 *  Client Config
 *
 **********************************************************************************************************************/
const serverRules = {
    harvesters: require("../../server/config/game/harvesters")
};

const config = {
    DEBUG: true,
    LOCALES: {
        SUPPORT: ["en", "de"]
    },
    rules: {
        harvesters: serverRules.harvesters
    }
};

export default config;
