/***********************************************************************************************************************
 *
 * VUEX STATE MUTATIONS
 *
 * SYNC!!!
 *
 **********************************************************************************************************************/
import Vue from "vue";
import {pduRules} from "Config";
import {harvesterRules} from "Config";
import {DEBUG} from "Config";

const MUTATIONS = {
    /*
     * SET gameData
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload - game data object from api
     */
    SET_GAME_DATA: (state, payload) => {
        DEBUG && console.log("committing game data to store ", payload);
        state.game = payload.game;
        state.stars = payload.stars;
        state.planets = payload.planets;
        state.player = payload.player;
        state.resources = payload.resources;
        state.harvesters = payload.harvesters;
        state.pdus = payload.pdus;
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
     * SET/UNSET "Editing star name" for a specific star
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {Mongoose.ObjectId} payload.id
     * @param {Booleaen} payload.editing
     */
    EDITING_STAR_NAME: (state, payload) => {
        if (payload.editing) {
            state.editingStarName.push(payload.id); // add ID to array
        } else {
            state.editingStarName.splice(state.editingStarName.indexOf(payload.id), 1); // remove ID from array
        }
    },

    /*
     * SET/UNSET "Saving star name" for a specific star
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {Mongoose.ObjectId} payload.id
     * @param {Booleaen} payload.saving
     */
    SAVING_STAR_NAME: (state, payload) => {
        if (payload.saving) {
            state.savingStarName.push(payload.id); // add ID to array
        } else {
            state.savingStarName.splice(state.savingStarName.indexOf(payload.id), 1); // remove ID from array
        }
    },

    /*
     * update game data and set star name for a specific star
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {Mongoose.ObjectId] payload.id
     * @param {String} payload.name
     */
    SET_STAR_NAME: (state, payload) => {
        state.stars.forEach((star, index) => {
            if (star.id === payload.id) {
                star.name = payload.name;
                Vue.set(state.stars, index, star);
            }
        });
    },

    /*
     * update game data and add new harvester to planet
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {String} payload.harvesterType
     * @param {Mongoose.ObjectId} payload.planet
     * @param {Mongoose.ObjectId} payload.id
     * @param {Number} payload.turnsUntilComplete
     * @param {Boolean} payloiad.isHarvesting
     */
    ADD_HARVESTER: (state, payload) => {
        state.planets
            .find(planet => planet.id === payload.planet) // planet has correct id
            .resourceSlots.find(slot => slot.resourceType === payload.harvesterType) // resourceSlot has correct type
            .harvesters.push(payload.id);
        state.harvesters.push({
            id: payload.id,
            isHarvesting: payload.isHarvesting,
            resourceType: payload.harvesterType,
            turnsUntilComplete: payload.turnsUntilComplete
        });
    },

    /*
     * SET/UNSET "Saving Install Harvester" for a specific planet
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {Mongoose.ObjectId} payload.resourceId
     * @param {Booleaen} payload.saving
     */
    SAVING_INSTALL_HARVESTER: (state, payload) => {
        if (payload.saving) {
            // add slot to array
            state.installingResourceTypes.push(payload.resourceId);
        } else {
            // remove ID from array
            state.installingResourceTypes.splice(state.installingResourceTypes.indexOf(payload.resourceId), 1);
        }
    },

    /*
     * pay harvester by changing player resources.
     * this is clientside, but it is enforeced by the server.
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {String} payload.harvesterType
     */
    PAY_HARVESTER: (state, payload) => {
        const costs = harvesterRules.types.find(harvester => harvester.type === payload.harvesterType).costs;
        costs.forEach(slot => {
            state.resources.find(resource => resource.type === slot.resourceType).current -= slot.amount;
        });
    },

    /*
     * SET/UNSERT "Installing PDUs on planet"
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {Mongoose.ObjectId} payload.planet
     * @param {Booleaen} payload.saving
     */
    SAVING_BUILD_PDU_PLANET: (state, payload) => {
        if (payload.saving) {
            // add slot to array
            state.savingBuildPduPlanets.push(payload.planet);
        } else {
            // remove ID from array
            state.savingBuildPduPlanets.splice(state.savingBuildPduPlanets.indexOf(payload.planet), 1);
        }
    },

    /*
     * add new PDUs from server to state
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {Mongoose.ObjectId} payload.planetId
     * @param {Array} payload.pduIds
     * @param {Number} payload.turnsUntilComplete
     * @param {String} payload.pduType
     */
    ADD_PDUS: (state, payload) => {
        let pdus = payload.pduIds.map(pduId => {
            return {
                id: pduId,
                isActive: payload.turnsUntilComplete === 0,
                planet: payload.planetId,
                turnsUntilComplete: payload.turnsUntilComplete,
                pduType: payload.pduType
            };
        });
        state.pdus = state.pdus.concat(pdus);
    },

    /*
     * pay for PDUs by changing player resources.
     * this is clientside, but it is enforeced by the server.
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {String} payload.pduType
     * @param {Number} payload.amount
     */
    PAY_PDUS: (state, payload) => {
        const costs = pduRules.types.find(pdu => pdu.type === payload.pduType).costs;
        costs.forEach(slot => {
            state.resources.find(resource => resource.type === slot.resourceType).current -= Math.floor(
                slot.amount * payload.amount
            );
        });
    },

    /*
     * SET/UNSERT "Installing PDUs on planet"
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {Mongoose.ObjectId} payload.planet
     * @param {Booleaen} payload.saving
     */
    SAVING_FOOD_CONSUMPTION: (state, payload) => {
        if (payload.saving) {
            // add slot to array
            state.savingFoodConsumption.push(payload.planet);
        } else {
            // remove ID from array
            state.savingFoodConsumption.splice(
                state.savingFoodConsumption.indexOf(payload.planet),
                1
            );
        }
    },

    /*
     * Change food consumption of planet
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {Mongoose.ObjectId} payload.planet
     * @param {Number} payload.consumption
     */
    CHANGE_FOOD_CONSUMPTION: (state, payload) => {
        console.log("committing change food consumption", payload);
        state.planets.forEach((planet, index) => {
            if (planet.id === payload.planet) {
                planet.foodConsumption = payload.consumption;
                Vue.set(state.planets, index, planet);
            }
        });
    }
};

export default MUTATIONS;
