/***********************************************************************************************************************
 *
 * VUEX ACTIONS
 *
 * ASYNC
 *
 **********************************************************************************************************************/
import axios from "axios";
import {applyServerPulse} from "../../../components/game/time";
import {persistUserSettings} from "../../handlers/userSettings";
import {DEBUG} from "../../../config";

export const commonActions = {

    /*
     * fetch game data from api via XHR
     * @param {Object} ctx - Vuex $store context
     * @param {Object} payload
     * @param {String} payload.area
     */
    SET_INITIAL_STATE: function(ctx, payload) {
        ctx.commit("SET_GAME_DATA", payload);
    },

    /*
     * set user settings
     * @param {Object} ctx - Vuex $store context
     * @param {Object} payload
     */
    SET_USER_SETTINGS: function(ctx, payload) {
        ctx.commit("SET_USER_SETTINGS", payload);
        persistUserSettings(payload);
    },

    /*
     * persist user settings in local storage
     * @param {Object} ctx - Vuex $store context
     * @param {Object} payload
     */
    PERSIST_USER_SETTINGS: function(ctx, payload) {
        persistUserSettings(payload);
    },

    /*
     * fetch game data from api via XHR
     * @param {Object} ctx - Vuex $store context
     * @param {Object} payload
     * @param {String} payload.area
     */
    FETCH_GAMEDATA_FROM_API: function(ctx, payload) {
        DEBUG && console.log(`fetching game data from api for area ${payload.area}`);
        ctx.commit("FETCHING_GAME_DATA_FROM_API", true);
        axios
            .get(`/api/game/${payload.area}/data`)
            .then(response => {
                if (response.status === 200 && response.data) {
                    ctx.commit("SET_GAME_DATA", response.data);
                    applyServerPulse(response.data.game);
                }
                ctx.commit("FETCHING_GAME_DATA_FROM_API", false);
            })
            .catch(error => {
                console.error(error);
                ctx.commit("FETCHING_GAME_DATA_FROM_API", false);
            });
    },

    /*
     * request "upgrade storage levels"
     * @param {Object} ctx - Vuex $store context
     * @param {String} payload
     */
    UPGRADE_STORAGE_LEVELS: function(ctx, payload) {
        DEBUG && console.log(`upgrading storage level for ${payload}`);
        ctx.commit("UPGRADING_STORAGE_LEVEL", {upgrading: true, area: payload});
        axios
            .post(`/api/game/storage-upgrade/${payload}`)
            .then(response => {
                if (response.status === 200 && response.data && response.data.storageUpgrade) {
                    const upgrade = response.data.storageUpgrade;
                    ctx.commit("PAY_STORAGE_UPGRADE", {area: upgrade.area, newLevel: upgrade.newLevel});
                    ctx.commit("ADD_STORAGE_UPGRADE", upgrade);
                }
                if (response.data && response.data.error) { // server has error message ?
                    this._vm.$snotify.error(response.data.error);
                }
                ctx.commit("UPGRADING_STORAGE_LEVEL", {upgrading: false, area: payload});
            })
            .catch(error => {
                console.error(error);
                ctx.commit("UPGRADING_STORAGE_LEVEL", {upgrading: false, area: payload});
            });
    }
};


