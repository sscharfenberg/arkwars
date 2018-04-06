/***********************************************************************************************************************
 *
 * VUEX ACTIONS
 *
 * ASYNC
 *
 **********************************************************************************************************************/
//import axios from "axios";
//import {DEBUG} from "../../../config";
import {commonActions} from "../../common/store/actions";

const ACTIONS = {

    ...commonActions,

    /*
     * SET selected shipyards section
     * @param {Object} ctx - Vuex $store context
     * @param {String} payload
     */
    SET_SHIPYARD_SECTION: function(ctx, payload) {
        ctx.commit("SET_SHIPYARD_SECTION", payload);
    }

};

export default ACTIONS;
