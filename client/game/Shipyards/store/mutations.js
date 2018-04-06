/***********************************************************************************************************************
 *
 * VUEX STATE MUTATIONS
 *
 * SYNC!!!
 *
 **********************************************************************************************************************/
import {commonMutations} from "../../common/store/mutations";
import {persistUserSettings} from "../../handlers/userSettings";

const MUTATIONS = {

    ...commonMutations,

    /*
     * SET selected shipyards section
     * @param {Object} state - Vuex $store.state
     * @param {String} payload
     */
    SET_SHIPYARD_SECTION: (state, payload) => {
        state.userSettings.shipyards.selectedSection = payload;
        persistUserSettings(state.userSettings); // persist settings in localstorage
    }

};

export default MUTATIONS;
