/***********************************************************************************************************************
 *
 * VUEX ACTIONS
 *
 * ASYNC
 *
 **********************************************************************************************************************/
import axios from "axios";
import {DEBUG} from "../../../config";
import {commonActions} from "../../common/store/actions";

const ACTIONS = {

    ...commonActions,

    /*
     * SET/UNSET "toggled stars"
     * @param {Object} ctx - Vuex $store context
     * @param {Mongoose.ObjectId} payload
     */
    TOGGLE_SHOW_PLANETS: function(ctx, payload) {
        ctx.commit("TOGGLE_SHOW_PLANETS", payload);
    },

    /*
     * toggle editing star name
     * @param {Object} ctx - Vuex $store context
     * @param {Mongoose.ObjectId} payload.id
     * @param {Boolean} payload.editing
     */
    EDIT_STAR_NAME: function(ctx, payload) {
        DEBUG && console.log(`${payload.editing ? "editing" : "canceled editing"} star name of id ${payload.id}`);
        ctx.commit("EDITING_STAR_NAME", payload);
    },

    /*
     * post xhr "change star name" request
     * @param {Mongoose.ObjectId} payload.id
     * @param {Boolean} payload.saving
     */
    SAVE_STAR_NAME: function(ctx, payload) {
        DEBUG && console.log("save changed star name");
        ctx.commit("SAVING_STAR_NAME", {id: payload.id, saving: true});
        axios
            .post("/api/game/empire/star/name", {
                id: payload.id,
                name: payload.starName
            })
            .then(response => {
                if (response.status === 200 && response.data && !response.data.error) {
                    ctx.commit("SET_STAR_NAME", {id: payload.id, name: payload.starName});
                }
                if (response.data.error) {
                    this._vm.$snotify.error(response.data.error);
                }
                ctx.commit("EDITING_STAR_NAME", {id: payload.id, editing: false});
                ctx.commit("SAVING_STAR_NAME", {id: payload.id, saving: false});
            })
            .catch(error => {
                console.error(error);
                ctx.commit("SAVING_STAR_NAME", {id: payload.id, saving: false});
            });
    },

    /*
     * post "install harvester on planet" request
     * @param {Mongoose.ObjectId} payload.resourceId
     * @param {Boolean} payload.saving
     */
    INSTALL_HARVESTER: function(ctx, payload) {
        DEBUG && console.log("requesting install harvestester", payload);
        ctx.commit("SAVING_INSTALL_HARVESTER", {resourceId: payload.resourceId, saving: true});
        axios
            .post("/api/game/empire/harvester/install", payload)
            .then(response => {
                if (response.status === 200 && response.data && !response.data.error) {
                    ctx.commit("ADD_HARVESTER", {
                        harvesterType: payload.harvesterType,
                        planet: payload.planet,
                        id: response.data.id,
                        turnsUntilComplete: response.data.turnsUntilComplete,
                        isHarvesting: false
                    });
                }
                // server has error message ?
                if (response.data.error) {
                    this._vm.$snotify.error(response.data.error);
                } else {
                    ctx.commit("PAY_HARVESTER", {harvesterType: payload.harvesterType});
                }
                ctx.commit("SAVING_INSTALL_HARVESTER", {resourceId: payload.resourceId, saving: false});
            })
            .catch(error => {
                console.error(error);
                ctx.commit("SAVING_INSTALL_HARVESTER", {
                    resourceId: payload.resourceId,
                    saving: false
                });
            });
    },

    /*
     * REQUEST BUILD PDUS
     * @param {Object} ctx - Vuex $store context
     * @param {Object} payload
     * @param {Mongoose.ObjectId} payload.planet
     * @param {String} payload.type
     * @param {Number} payload.amount
     */
    BUILD_PDUS: function(ctx, payload) {
        DEBUG && console.log("requesting build PDUs ", payload);
        ctx.commit("SAVING_BUILD_PDU_PLANET", {planet: payload.planet, saving: true});
        axios
            .post("/api/game/empire/pdu/build", payload)
            .then(response => {
                if (response.status === 200 && response.data && !response.data.error) {
                    DEBUG && console.log("recieved new PDUs from server ", response.data);
                    ctx.commit("ADD_PDUS", {
                        planetId: payload.planet,
                        pduIds: response.data.pduIds,
                        turnsUntilComplete: response.data.turnsUntilComplete,
                        pduType: response.data.pduType
                    });
                }
                // server has error message ?
                if (response.data.error) {
                    this._vm.$snotify.error(response.data.error);
                } else {
                    ctx.commit("PAY_PDUS", {pduType: payload.type, amount: payload.amount});
                }
                ctx.commit("SAVING_BUILD_PDU_PLANET", {planet: payload.planet, saving: false});
            })
            .catch(error => {
                console.error(error);
                ctx.commit("SAVING_BUILD_PDU_PLANET", {planet: payload.planet, saving: false});
            });
    },

    /*
     * REQUEST CHANGE FOOD CONSUMPTION
     * @param {Object} ctx - Vuex $store context
     * @param {Object} payload
     * @param {Mongoose.ObjectId} payload.planet
     * @param {Number} payload.consumption
     */
    CHANGE_FOOD_CONSUMPTION: function(ctx, payload) {
        DEBUG && console.log("requesting change food consumption ", payload);
        ctx.commit("SAVING_FOOD_CONSUMPTION", {planet: payload.planet, saving: true});
        axios
            .post("/api/game/empire/planet/food", payload)
            .then(response => {
                if (response.status === 200 && response.data && !response.data.error) {
                    DEBUG && console.log("recieved new data from server ", response.data);
                    ctx.commit("CHANGE_FOOD_CONSUMPTION", {planet: payload.planet, consumption: payload.consumption});
                }
                // server has error message ?
                if (response.data.error) {
                    this._vm.$snotify.error(response.data.error);
                }
                ctx.commit("SAVING_FOOD_CONSUMPTION", {planet: payload.planet, saving: false});
            })
            .catch(error => {
                console.error(error);
                ctx.commit("SAVING_FOOD_CONSUMPTION", {planet: payload.planet, saving: false});
            });
    },

    /*
     * REQUEST SHIPYARD CONSTRUCTION
     * @param {Object} ctx - Vuex $store context
     * @param {Object} payload
     * @param {Mongoose.ObjectId} payload.planet
     * @param {String} payload.type
     */
    CONSTRUCT_SHIPYARD: function(ctx, payload) {
        DEBUG && console.log(`requesting ${payload.type} shipyard construction on planet #${payload.planet}`);
        ctx.commit("SHIPYARD_REQUESTING", {id: payload.planet, requesting: true});
        axios
            .post("/api/game/empire/shipyard/new", payload)
            .then(response => {
                if (response.status === 200 && response.data && !response.data.error && response.data.shipyard) {
                    DEBUG && console.log("recieved new shipyard from server ", response.data);
                    ctx.commit("ADD_SHIPYARD", response.data.shipyard);
                    ctx.commit(
                        "PAY_NEW_SHIPYARD",
                        response.data.shipyard.hullTypes[response.data.shipyard.hullTypes.length - 1]
                    );
                }
                if (response.data && response.data.error) {
                    this._vm.$snotify.error(response.data.error);
                }
                ctx.commit("SHIPYARD_REQUESTING", {id: payload.planet, requesting: false});
            })
            .catch(error => {
                console.error(error);
                ctx.commit("SHIPYARD_REQUESTING", {id: payload.planet, requesting: false});
            });
    },

    /*
     * REQUEST SHIPYARD UPGRADE
     * @param {Object} ctx - Vuex $store context
     * @param {Object} payload
     * @param {Mongoose.ObjectId} payload.id
     * @param {Mongoose.ObjectId} payload.planet
     */
    UPGRADE_SHIPYARD: function(ctx, payload) {
        DEBUG && console.log(`requesting upgrade of shipyard ${JSON.stringify(payload)}`);
        ctx.commit("SHIPYARD_REQUESTING", {id: payload.planet, requesting: true});
        axios
            .post("/api/game/empire/shipyard/upgrade", {id: payload.id})
            .then(response => {
                if (response.status === 200 && response.data && !response.data.error && response.data.shipyard) {
                    DEBUG && console.log("recieved updated shipyard from server ", response.data.shipyard);
                    ctx.commit("UPDATE_SHIPYARD", response.data.shipyard);
                    ctx.commit(
                        "PAY_UPGRADED_SHIPYARD",
                        response.data.shipyard.hullTypes[response.data.shipyard.hullTypes.length - 1]
                    );
                }
                if (response.data && response.data.error) {
                    this._vm.$snotify.error(response.data.error);
                }
                ctx.commit("SHIPYARD_REQUESTING", {id: payload.planet, requesting: false});
            })
            .catch(error => {
                console.error(error);
                ctx.commit("SHIPYARD_REQUESTING", {id: payload.planet, requesting: false});
            });
    }
};

export default ACTIONS;
