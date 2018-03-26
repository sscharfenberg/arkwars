/***********************************************************************************************************************
 *
 * VUEX ACTIONS
 *
 * ASYNC
 *
 **********************************************************************************************************************/
import axios from "axios";
import {applyServerPulse} from "../../../components/game/time";
import {DEBUG} from "../../../config";

const ACTIONS = {

    /*
     * set initial state that we get from html dom
     * @param {Object} ctx - Vuex $store context
     * @param {Object} payload
     * @param {String} payload.area
     */
    SET_INITIAL_STATE: function(ctx, payload) {
        DEBUG && console.log("setting intial state");
        ctx.commit("SET_GAME_DATA", payload);
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
     * request "change research order"
     * @param {Object} ctx - Vuex $store context
     * @param {Array} payload - Array of full research objects
     */
    CHANGE_RESEARCH_ORDER: function(ctx, payload) {
        let pos = 0;
        let data = payload.map(res => {
            res.order = pos;
            pos++;
            return res;
        });
        DEBUG && console.log(`requesting change research order ${payload.map(res => `${res.area} TL${res.newLevel}`)}`);
        ctx.commit("IS_CHANGING_ORDER", true);
        // we pre-emptively change the state to be `snappier`. we roll back the changes in case of error
        ctx.commit("SET_RESEARCHES", data);
        axios
            .post("/api/game/research/order", data)
            .then(response => {
                if (response.data && !response.data.error) {
                    ctx.commit("SET_RESEARCHES", response.data);
                }
                if (response.data && response.data.error) { // server has error message ?
                    this._vm.$snotify.error(response.data.error);
                    ctx.commit("SET_RESEARCHES", response.data.researches);
                }
                ctx.commit("IS_CHANGING_ORDER", false);
            })
            .catch(error => {
                console.error(error);
                ctx.commit("IS_CHANGING_ORDER", false);
                ctx.commit("ROLLBACK_RESEARCHES");
            });
    },

    /*
     * request "delete research job"
     * @param {Object} ctx - Vuex $store context
     * @param {String} payload - ID of research job
     */
    DELETE_RESEARCH_JOB: function(ctx, payload) {
        DEBUG && console.log(`requesting delete research job #${payload}`);
        ctx.commit("DELETING_RESEARCH_JOB", {id: payload, deleting: true});
        axios
            .post("/api/game/research/delete", { id: payload })
            .then(response => {
                if (response.data && !response.data.error) {
                    ctx.commit("SET_RESEARCHES", response.data);
                }
                if (response.data && response.data.error) { // server has error message ?
                    this._vm.$snotify.error(response.data.error);
                }
                ctx.commit("DELETING_RESEARCH_JOB", {id: payload, deleting: false});
            })
            .catch(error => {
                console.error(error);
                ctx.commit("DELETING_RESEARCH_JOB", {id: payload, deleting: false});
            });
    },

    /*
     * request "change research priority"
     * @param {Object} ctx - Vuex $store context
     * @param {String} payload - new priority
     */
    CHANGE_RESEARCH_PRIORITY: function(ctx, payload) {
        DEBUG && console.log(`requesting change research priority to ${payload}`);
        ctx.commit("CHANGING_RESEARCH_PRIORITY", true);
        axios
            .post("/api/game/research/priority", { researchPriority: payload })
            .then(response => {
                if (response.data && !response.data.error) {
                    ctx.commit("SET_RESEARCH_PRIORITY", response.data.researchPriority);
                }
                if (response.data && response.data.error) { // server has error message ?
                    this._vm.$snotify.error(response.data.error);
                    if (response.data.researchPriority) {
                        ctx.commit("SET_RESEARCH_PRIORITY", response.data.researchPriority);
                    }
                }
                ctx.commit("CHANGING_RESEARCH_PRIORITY", false);
            })
            .catch(error => {
                console.error(error);
                ctx.commit("CHANGING_RESEARCH_PRIORITY", false);
            });
    },

    /*
     * request "start research job"
     * @param {Object} ctx - Vuex $store context
     * @param {Objewct} payload
     * @param {String} payload.area
     */
    START_RESEARCH_JOB: function(ctx, payload) {
        DEBUG && console.log("requesting start research job: ", payload);
        ctx.commit("STARTING_RESEARCH_JOB", {area: payload.area, starting: true});
        axios
            .post("/api/game/research/start", payload)
            .then(response => {
                if (response.data && !response.data.error) {
                    ctx.commit("SET_RESEARCHES", response.data);
                }
                if (response.data && response.data.error) { // server has error message ?
                    this._vm.$snotify.error(response.data.error);
                }
                ctx.commit("STARTING_RESEARCH_JOB", {area: payload.area, starting: false});
            })
            .catch(error => {
                console.error(error);
                ctx.commit("STARTING_RESEARCH_JOB", {area: payload.area, starting: false});
            });
    }

};

export default ACTIONS;
