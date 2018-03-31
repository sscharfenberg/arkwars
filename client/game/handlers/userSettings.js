/***********************************************************************************************************************
 *
 * userSettings handler
 * userSettings are persisted via localStorage
 *
 **********************************************************************************************************************/
import {DEBUG} from "../../config";
import {localStorageKey} from "../../config";

/*
 * default settings
 */
export const defaultSettings = {
    version: 3,
    empire: {
        toggledStars: []
    }
};

/*
 * find out if localstorage is available and works without throwing exceptions =========================================
 * @returns {Boolean}
 */
export const storageAvailable = () => {
    let storage = window.localStorage;
    let x = "__storage_test__";
    try {
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === "QuotaExceededError" ||
            // Firefox
            e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
};

/*
 * get User Settings from localStorage =================================================================================
 * @returns {Object}
 */
export const getUserSettings = () => {
    // local storage not supported / not working
    if (!storageAvailable()) return defaultSettings;

    const userSettings = JSON.parse(localStorage.getItem(localStorageKey));

    // key not found in local storage
    if (!userSettings) {
        DEBUG && console.warn("no user settings found, using defaults.");
        persistUserSettings(defaultSettings);
        return defaultSettings;
    }

    // version is not identical => update
    if (userSettings.version !== defaultSettings.version) {
        DEBUG && console.warn("user has different version, using defaults.");
        persistUserSettings(defaultSettings);
        return defaultSettings;
    }

    DEBUG && console.log("fetched userSettings from localStorage");
    return userSettings;
};

/*
 * persist userSettings in localStorage ================================================================================
 * @param {Object} userSettings
 */
export const persistUserSettings = (userSettings) => {
    // local storage not supported / not working
    if (!storageAvailable()) return false;
    return localStorage.setItem(localStorageKey, JSON.stringify(userSettings));
};
