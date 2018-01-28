/** ********************************************************************************************************************
 *
 *  Client Config
 *
 **********************************************************************************************************************/
const serverRules = {
    harvesters: require("../../shared/rules/harvesters"),
    pdus:  require("../../shared/rules/pdus")
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
