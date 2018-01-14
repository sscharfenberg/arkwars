/***********************************************************************************************************************
 *
 * VUEX MUTATIONS
 *
 * SYNC
 *
 **********************************************************************************************************************/
import Vue from "vue";
import cfg from "../../config";

const MUTATIONS = {
    /* =================================================================================================================
     * COMMON MUTATIONS ================================================================================================
     * ============================================================================================================== */

    /*
     * SET gameData
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload - game data object from api
     */
    SET_GAME_DATA: (state, payload) => {
        cfg.DEBUG && console.log("committing game data to store", payload);
        state.gameData = payload;
    },

    /*
     * SET/UNSET "Fetching Game Data From Api"
     * @param {Object} state - Vuex $store.state
     * @param {Boolean} payload - true for set, false for unset
     */
    FETCHING_GAME_DATA_FROM_API: (state, payload) => {
        state.fetchingGameDataFromApi = payload;
    },

    /* =================================================================================================================
     * EMPIRE MUTATIONS ================================================================================================
     * ============================================================================================================== */

    /*
     * SET/UNSET "Editing star name" for a specific star
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload - {id:Mongoose.ObjectId, editing:Boolean}
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
     * @param {Object} payload - {id:Mongoose.ObjectId, saving:Boolean}
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
     * @param {Object} payload - {id:Mongoose.ObjectId, name:String}
     */
    SET_STAR_NAME: (state, payload) => {
        state.gameData.stars.forEach((star, index) => {
            if (star.id === payload.id) {
                star.name = payload.name;
                Vue.set(state.gameData.stars, index, star);
            }
        });
    },

    /*
     * update game data and add new harvester to planet
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload - {id:Mongoose.ObjectId, saving:Boolean}
     */
    ADD_HARVESTER: (state, payload) => {
        let allPlanets = [];
        state.gameData.stars.forEach(star => {
            allPlanets = allPlanets.concat(star.planets);
        });
        const planet = allPlanets.find(planet => planet.id === payload.planet);
        const slot = planet.resourceSlots.find(slot => slot.resourceType === payload.harvesterType);
        const harvesters = slot.harvesters;
        harvesters.push({
            id: payload.id,
            isHarvesting: payload.isHarvesting,
            resourceType: payload.harvesterType,
            turnsUntilComplete: payload.turnsUntilComplete
        });
    },

    /*
     * SET/UNSET "Saving Install Harvester" for a specific planet
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload - {id:Mongoose.ObjectId, saving:Boolean}
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
     * @param {Object} payload - {id:Mongoose.ObjectId, saving:Boolean}
     */
    PAY_HARVESTER: (state, payload) => {
        console.log("pay for harvester ", costs);
        const costs = cfg.rules.harvesters.build.find(harvester => harvester.type === payload.harvesterType).costs;
        costs.forEach( slot => {
            state.gameData.resources.find(resource => resource.type === slot.resourceType).current -= slot.amount;
        });
    }
};

export default MUTATIONS;
