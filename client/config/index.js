/** ********************************************************************************************************************
 *
 *  Client Config
 *
 **********************************************************************************************************************/
const serverRules = {
    harvesters: require("../../server/config/game/harvesters"),
    pdus:  require("../../server/config/game/pdus")
};

const config = {
    DEBUG: true,
    LOCALES: {
        SUPPORT: ["en", "de"]
    },
    rules: {
        harvesters: serverRules.harvesters,
        pdus: serverRules.pdus
    }
};

export default config;
