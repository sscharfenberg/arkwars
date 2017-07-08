/** ********************************************************************************************************************
 *
 * drawer with left navigation
 * @exports {function} initializeDrawer
 *
 **********************************************************************************************************************/
import cfg from "../../config";

const defaultSettings = {
    version: 1,
    drawerOpen: false
};

/*
 * converts a json string to JS object
 * @param {string} json
 * @returns {object}
 */
const jsonStringToObject = json => {
    if (typeof json !== "string") return {};
    try {
        return JSON.parse(json);
    } catch (error) {
        cfg.DEBUG && console.warn("got malformed JSON string: ", json);
        cfg.DEBUG && console.warn(error);
        return {};
    }
};

/*
 * converts a JS object to json string
 * @param {object} object
 * @returns {string} json
 */
const objectToJsonString = object => {
    if (typeof object !== "object") return "";
    try {
        return JSON.stringify(object);
    } catch (error) {
        cfg.DEBUG && console.warn("could not stringify object: ", object);
        cfg.DEBUG && console.warn(error);
        return "";
    }
};

/*
 * save settings to local storage
 * @param {string} key - localstorage key
 * @param {object} settings - app settings to save
 */
const saveSettings = (key, settings) => {
    if (!window.localStorage || !key || !settings) return;
    cfg.DEBUG && console.log("saving settings to localStorage:", settings);
    return localStorage.setItem(
        cfg.LOCALSTORAGE_KEY,
        objectToJsonString(settings)
    );
};

/*
 * load settings from local storage
 * @param {string} key - localStorage key
 * @returns {object} - object with values from localStorage
 */
const loadSettings = key => {
    let settings;
    if (!window.localStorage || !key) return;
    settings = localStorage.getItem(key);
    if (!settings) {
        return defaultSettings;
    } else if (jsonStringToObject(settings).version !== defaultSettings.version) {
        cfg.DEBUG && console.warn("localStorage has differnt version - updating to new defaults.");
        saveSettings(key, defaultSettings);
        return defaultSettings;
    } else {
        return jsonStringToObject(settings);
    }
};

export { defaultSettings, saveSettings, loadSettings };
