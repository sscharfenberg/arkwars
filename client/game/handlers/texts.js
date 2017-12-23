/** ********************************************************************************************************************
 *
 * handling of texts
 * @exports { saveSettings, loadSettings }
 *
 **********************************************************************************************************************/
import axios from "axios";
import moment from "moment";
import "moment/locale/de"; // import the locale even though webpack ignores moment/locale
import cfg from "../../config";

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
 * save texts to local storage
 * @param {string} language - "en" || "de"
 * @param {string} area - "empire" || "fleets" etc...
 * @param {object} texts - Object containing the texts to cache
 * @returns {Boolean}
 */
const saveTextStringsToCache = (language, area, texts) => {
    if (!window.localStorage || !language || !area || !texts) return;
    cfg.DEBUG && console.log(`caching texts "txt-${language}-${area}" `, texts);
    localStorage.setItem(
        `txt-${language}-${area}`,
        objectToJsonString(texts)
    );
};

/*
 * get text strings, either from local storage or from server
 * @param {string} language - "en" || "de"
 * @param {string} area - "empire" || "fleets" etc...
 * @param {string} version - ISO 8601 string
 * @param {function} cb - callback
 */
const loadTextStringsFromCache = (language, area, version, cb) => {
    if (!window.localStorage || !language || !area) return;
    let textCache = localStorage.getItem(`txt-${language}-${area}`);
    let texts = jsonStringToObject(textCache);
    let noCache = !textCache;
    let versionDiffers = moment(version).isAfter(moment(texts.version)) || false;

    noCache && cfg.DEBUG && console.warn("no texts cached.");
    versionDiffers && cfg.DEBUG && console.warn("cached texts have a different version.");

    if (noCache || versionDiffers) {
        console.log(
            `asking server for texts "txt-${language}-${area}".`
        );
        axios
            .get(`/api/textstrings/${language}/${area}`)
            .then(response => {
                if (response.status === 200 && response.data) {
                    cfg.DEBUG && console.log("recieved texts from server: ", response.data);
                    saveTextStringsToCache(language, area, response.data);
                    cb(response.data);
                }
            })
            .catch(error => {
                cfg.DEBUG && console.error(error);
                cb({});
            });
    } else {
        cb(texts);
    }
};

export {saveTextStringsToCache, loadTextStringsFromCache};

