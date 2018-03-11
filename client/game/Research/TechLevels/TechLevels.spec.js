/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import Vuex from "vuex";
import VueI18n from "vue-i18n";
import {shallow, createLocalVue} from "@vue/test-utils";
import TechLevels from "./TechLevels.vue";
import TechLevel from "./TechLevel.vue";

/*
 * mock data
 */
const localVue = createLocalVue();
localVue.use(VueI18n);
localVue.use(Vuex);
const i18n = new VueI18n({
    locale: "de",
    messages: {de: {techLevels:{label: "TechLevels"}}}
});
const store = new Vuex.Store({
    state: {},
    getters: {
        playerTechLevels() {
            return [
                {type: "plasma", level: 7},
                {type: "railgun", level: 6},
                {type: "missile", level: 5},
                {type: "laser", level: 4},
                {type: "shields", level: 3},
                {type: "armour", level: 2},
            ];
        }
    }
});

/*
 * test suite
 */
describe("TechLevels.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(TechLevels, {
            localVue,
            i18n,
            store
        });
    });

    it("is a vue instance", () => {
        expect(cmp.isVueInstance()).toBeTruthy();
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("renders the expected number of tech levels", () => {
        expect(cmp.findAll(TechLevel).length).toBe(6);
    });
});
