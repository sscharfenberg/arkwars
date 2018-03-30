/***********************************************************************************************************************
 *
 * VUEX STATE MUTATIONS
 *
 * SYNC!!!
 *
 **********************************************************************************************************************/
import {DEBUG} from "Config";
import {playerRules} from "Config";

export const commonMutations = {
    /*
     * SET gameData
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload - game data object from api
     */
    SET_GAME_DATA: (state, payload) => {
        DEBUG && console.log("committing game data to store ", payload);
        // common
        if (payload.game) state.game = payload.game;
        if (payload.player) state.player = payload.player;
        if (payload.resources) state.resources = payload.resources;
        if (payload.upgradingStorageLevels) state.upgradingStorageLevels = payload.upgradingStorageLevels;
        if (payload.storageUpgrades) state.storageUpgrades = payload.storageUpgrades;
        // area = empire
        if (payload.stars) state.stars = payload.stars;
        if (payload.planets) state.planets = payload.planets;
        if (payload.harvesters) state.harvesters = payload.harvesters;
        if (payload.pdus) state.pdus = payload.pdus;
        // area = research
        if (payload.techLevels) state.techLevels = payload.techLevels;
        if (payload.researches) state.researches = payload.researches;
    },

    /*
     * SET/UNSET "Fetching Game Data From Api"
     * @param {Object} state - Vuex $store.state
     * @param {Boolean} payload - true for set, false for unset
     */
    FETCHING_GAME_DATA_FROM_API: (state, payload) => {
        state.fetchingGameDataFromApi = payload;
    },

    /*
     * SET/UNSET "upgrading storage level" for a specific area
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {String} payload.area
     * @param {Booleaen} payload.upgrading
     */
    UPGRADING_STORAGE_LEVEL: (state, payload) => {
        if (payload.upgrading) {
            state.upgradingStorageLevels.push(payload.area);
        } else {
            state.upgradingStorageLevels.splice(state.upgradingStorageLevels.indexOf(payload.area), 1);
        }
    },

    /*
     * ADD new storage upgrade (building) to state
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {String} payload.id
     * @param {String} payload.area
     * @param {Number} payload.newLevel
     * @param {Number} payload.turnsUntilComplete
     */
    ADD_STORAGE_UPGRADE: (state, payload) => {
        state.storageUpgrades.push(payload);
    },

    /*
     * pay for PDUs by changing player resources.
     * this is clientside, but it is enforeced by the server.
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {String} payload.area
     * @param {Number} payload.newLevel
     */
    PAY_STORAGE_UPGRADE: (state, payload) => {
        const costs = playerRules.resourceTypes
            .find(res => res.type === payload.area)
            .storageLevels.find(cost => cost.lvl === payload.newLevel)
            .costs.filter(cost => cost.resourceType !== "turns");
        console.log(state.resources, costs);
        costs.forEach(slot => {
            state.resources.find(resource => resource.type === slot.resourceType).current -= Math.floor(slot.amount);
        });
    },

};
