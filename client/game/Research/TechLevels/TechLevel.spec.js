/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import Vuex from "vuex";
import VueI18n from "vue-i18n";
import {shallow, createLocalVue} from "@vue/test-utils";
import TechLevel from "./TechLevel.vue";

/*
 * mock data
 */
const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueI18n);
const i18n = new VueI18n({
    locale: "de",
    messages: {de: {techLevels:{shields: "Schutzschilde"}, research: {start: "Forschung starten"}}}
});
const store = new Vuex.Store({
    state: {},
    getters: {
        playerResearches() {
            return [
                {area: "laser", order: 0, work: 50, remaining: 1500},
                {area: "armour", order: 0, work: 50, remaining: 1500}
            ];
        }
    }
});

/*
 * test suite
 */
describe("TechLevel.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(TechLevel, {
            localVue,
            i18n,
            store,
            propsData: {
                tlType: "shields",
                level: 4
            }
        });
    });

    it("is a vue instance", () => {
        expect(cmp.isVueInstance()).toBeTruthy();
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("shows the correct tech level as active", () => {
        expect(cmp.find(".current").text()).toBe("4");
    });

    it("shows the correct headline for the tech level type", () => {
        expect(cmp.find("h4").text()).toBe("Schutzschilde");
    });
});
