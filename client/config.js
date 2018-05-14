/** ********************************************************************************************************************
 *
 *  Client Config
 *  we use only named exports so we can seperate and minify bundles better
 *
 **********************************************************************************************************************/
export const localStorageKey = "user-settings";

// needs to match /server/config/index.js
// first locale is the default
export const LOCALES = ["en", "de"];

// game rules
export const harvesterRules = require("../shared/rules/harvesters");
export const pduRules = require("../shared/rules/pdus");
export const techRules = require("../shared/rules/tech");
export const playerRules = require("../shared/rules/player");
export const shipyardRules = require("../shared/rules/shipyards");
export const shipClassRules = require("../shared/rules/shipClasses");
export const moduleRules = require("../shared/rules/modules");

// output console.log info messages. warn and error are always printed.
export const DEBUG = true;
