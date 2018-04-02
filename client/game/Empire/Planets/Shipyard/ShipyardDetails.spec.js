/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import VueI18n from "vue-i18n";
import Vuex from "vuex";
import {shallow, createLocalVue} from "@vue/test-utils";
import ShipyardDetails from "./ShipyardDetails.vue";

/*
 * mock data
 */
const localVue = createLocalVue();
localVue.use(VueI18n);
const i18n = new VueI18n({
    locale: "de",
    messages: {
        de: {
            common: {
                shipyards: { shipTypes: "Schiffstype" },
                ships: {
                    hullTypes: {
                        "small": "Destroyer",
                        "medium": "Cruiser",
                        "large": "Battleship",
                        "ark": "Ark"
                    }
                }
            }
        }
    }
});
localVue.use(Vuex);
const store = new Vuex.Store({
    state: {},
    getters: {
        shipyardById(id) {
            return function() {
                return {
                    active: true,
                    hullTypes: ["small", "medium"],
                    id,
                    planet: "5ac00d6e0698f025dc1ff51c",
                    turnsUntilComplete: 0
                };
            };
        }
    }
});

/*
 * test suite
 */
describe("ShipyardDetails.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(ShipyardDetails, {
            localVue,
            i18n,
            store,
            propsData: {
                id: "5ac00d6e0698f025dc1ff60a"
            }
        });
    });

    it("is a vue instance", () => {
        expect(cmp.isVueInstance()).toBeTruthy();
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("shows the correct amount of available hulls", () => {
        expect(cmp.findAll(".hull.active").length).toBe(3);
    });
});
