/***********************************************************************************************************************
 *
 * VUEX ACTIONS
 *
 * ASYNC
 *
 **********************************************************************************************************************/
import axios from "axios";
import cfg from "../../config";

const ACTIONS = {

    /* =================================================================================================================
     * COMMON ACTIONS===================================================================================================
     * ============================================================================================================== */

    /*
     * fetch game data from api via XHR
     */
    FETCH_GAMEDATA_FROM_API: function(ctx) {
        cfg.DEBUG && console.log("fetching game data from api");
        ctx.commit("FETCHING_GAME_DATA_FROM_API", true);
        axios
            .get("/api/game/empire/data")
            .then(response => {
                if (response.status === 200 && response.data) {
                    ctx.commit("SET_GAME_DATA", response.data);
                }
                ctx.commit("FETCHING_GAME_DATA_FROM_API", false);
            })
            .catch(error => {
                console.error(error);
                ctx.commit("FETCHING_GAME_DATA_FROM_API", false);
            });
    },

    /* =================================================================================================================
     * EMPIRE ACTIONS ==================================================================================================
     * ============================================================================================================== */

    /*
     * toggle editing star name
     */
    EDIT_STAR_NAME: function(ctx, payload) {
        cfg.DEBUG && console.log(`${payload.editing ? "editing" : "canceled editing"} star name of id ${payload.id}`);
        ctx.commit("EDITING_STAR_NAME", payload);
    },

    /*
     * post xhr "change star name" request
     */
    SAVE_STAR_NAME: function(ctx, payload) {
        cfg.DEBUG && console.log("save changed star name");
        ctx.commit("SAVING_STAR_NAME", {id: payload.id, saving: true});
        axios
            .post("/api/game/empire/star/name", {
                id: payload.id,
                name: payload.starName
            })
            .then(response => {
                if (response.status === 200 && response.data) {
                    ctx.commit("SET_STAR_NAME", {id: payload.id, name: payload.starName});
                }
                ctx.commit("SAVING_STAR_NAME", {id: payload.id, saving: false});
                ctx.commit("EDITING_STAR_NAME", {id: payload.id, editing: false});
            })
            .catch(error => {
                console.error(error);
                ctx.commit("SAVING_STAR_NAME", {id: payload.id, saving: false});
                ctx.commit("EDITING_STAR_NAME", {id: payload.id, editing: false});
            });
    }
};

export default ACTIONS;
