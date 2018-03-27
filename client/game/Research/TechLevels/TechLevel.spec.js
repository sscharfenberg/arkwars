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
    messages: {
        de: {
            techLevels: {shields: "Schutzschilde", laser: "Laser", armour: "Panzerung", missile: "Raketen"},
            research: {start: "TL{tl} Erforschen"}
        }
    }
});
const store = new Vuex.Store({
    state: {},
    getters: {
        playerResearches() {
            return [
                {area: "laser", order: 0, newLevel: 1},
                {area: "armour", order: 1, newLevel: 1},
                {area: "shields", order: 2, newLevel: 5},
                {area: "shields", order: 3, newLevel: 6}
            ];
        },
        startingResearchJobs() {
            return ["laser", "armour"];
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

    it("calculates the correct next level", () => {
        expect(cmp.vm.nextLevel).toBe(7);
        cmp.setProps({tlType: "laser", level: 0});
        expect(cmp.vm.nextLevel).toBe(2);
        cmp.setProps({tlType: "missile", level: 0});
        expect(cmp.vm.nextLevel).toBe(1);
    });

    it("shows the correct headline for the tech level type", () => {
        expect(cmp.find("h4").text()).toBe("Schutzschilde");
    });
});
