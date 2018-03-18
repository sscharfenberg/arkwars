/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import Vuex from "vuex";
import VueI18n from "vue-i18n";
import {shallow, createLocalVue} from "@vue/test-utils";
import LevelOverview from "./LevelOverview.vue";

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
            techLevels: {
                shields: "Shields",
                laser: "Laser",
                status: {researched: "researched", queued: "in queue", unresearched: "unresearched"}
            }
        }
    }
});
const store = new Vuex.Store({
    state: {},
    getters: {
        playerResearches() {
            return [{area: "shields", order: 0, newLevel: 5}, {area: "shields", order: 1, newLevel: 6}];
        }
    }
});

/*
 * test suite
 */
describe("LevelOverview.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(LevelOverview, {
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
        cmp.setProps({tlType: "laser", level: 1});
        expect(cmp.vm.nextLevel).toBe(2);
    });

    it("shows the job with order=0 as 'researching'", () => {
        expect(cmp.vm.getResearchedClass(5)).toBe("unresearched queued researching");
    });

    it("shows the correct number of unresearched items", () => {
        expect(cmp.findAll(".unresearched").length).toBe(6);
    });
});
