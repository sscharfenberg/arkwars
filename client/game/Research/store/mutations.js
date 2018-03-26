/***********************************************************************************************************************
 *
 * VUEX STATE MUTATIONS
 *
 * SYNC!!!
 *
 **********************************************************************************************************************/
import {DEBUG} from "Config";

const MUTATIONS = {
    /*
     * SET gameData
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload - game data object from API
     */
    SET_GAME_DATA: (state, payload) => {
        DEBUG && console.log("committing game data to store ", payload);
        state.game = payload.game;
        state.player = payload.player;
        state.resources = payload.resources;
        state.techLevels = payload.techLevels;
        state.researches = payload.researches;
    },

    /*
     * SET/UNSET "Fetching Game Data From API"
     * @param {Object} state - Vuex $store.state
     * @param {Boolean} payload - true for set, false for unset
     */
    FETCHING_GAME_DATA_FROM_API: (state, payload) => {
        state.fetchingGameDataFromApi = payload;
    },

    /*
     * SET/UNSET "Changing Research Order"
     * @param {Object} state - Vuex $store.state
     * @param {Boolean} payload - true for set, false for unset
     */
    IS_CHANGING_ORDER: (state, payload) => {
        state.changingResearchOrder = payload;
    },

    /*
     * SET researches
     * @param {Object} state - Vuex $store.state
     * @param {Boolean} payload - researches array from API
     */
    SET_RESEARCHES: (state, payload) => {
        state.researchRollBacks = state.researches;
        state.researches = payload;
    },

    /*
     * SET researches
     * @param {Object} state - Vuex $store.state
     */
    ROLLBACK_RESEARCHES: (state) => {
        state.researches = state.researchRollBacks;
    },

    /*
     * SET/UNSET "Editing star name" for a specific star
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {Mongoose.ObjectId} payload.id
     * @param {Booleaen} payload.deleting
     */
    DELETING_RESEARCH_JOB: (state, payload) => {
        if (payload.deleting) {
            state.deletingResearchJobs.push(payload.id);
        } else {
            state.deletingResearchJobs.splice(state.deletingResearchJobs.indexOf(payload.id), 1);
        }
    },

    /*
     * SET/UNSET "Changing research priority"
     * @param {Object} state - Vuex $store.state
     * @param {Boolean} payload
     */
    CHANGING_RESEARCH_PRIORITY: (state, payload) => {
        state.changingResearchPriority = payload;
    },

    /*
     * SET research priority
     * @param {Object} state - Vuex $store.state
     * @param {Number} payload
     */
    SET_RESEARCH_PRIORITY: (state, payload) => {
        state.player.researchPriority = payload;
    },

    /*
     * SET/UNSET "starting research job" for a specific area
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload
     * @param {String} payload.area
     * @param {Boolean} payload.starting
     */
    STARTING_RESEARCH_JOB: (state, payload) => {
        if (payload.starting) {
            state.startingResearchJobs.push(payload.area);
        } else {
            state.startingResearchJobs.splice(state.startingResearchJobs.indexOf(payload.area), 1);
        }
    },

    /*
     * ADD new research job to queue
     * @param {Object} state - Vuex $store.state
     * @param {Object} payload - new research object from API
     */
    ADD_RESEARCH_JOB: (state, payload) => {
        state.startingResearchJobs.push(payload);
    }

};

export default MUTATIONS;
