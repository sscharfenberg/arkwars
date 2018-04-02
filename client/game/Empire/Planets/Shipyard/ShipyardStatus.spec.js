/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import VueI18n from "vue-i18n";
import Vuex from "vuex";
import {shallow, createLocalVue} from "@vue/test-utils";
import ShipyardStatus from "./ShipyardStatus.vue";

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
                shipyards: { status: { "label": "Status", "ready": "Active", "constructing": "Constructing" } }
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
                    active: false,
                    hullTypes: ["small"],
                    id,
                    planet: "5ac00d6e0698f025dc1ff51c",
                    turnsUntilComplete: 96
                };
            };
        }
    }
});

/*
 * test suite
 */
describe("ShipyardStatus.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(ShipyardStatus, {
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

    it("identifies shipyard correctly as \"under construction\"", () => {
        expect(cmp.findAll("li.ready").length).toBe(0);
        expect(cmp.findAll("li.constructing").length).toBe(2);
        expect(cmp.findAll("li.constructing").at(1).text()).toMatch(/96/);
    });
});
