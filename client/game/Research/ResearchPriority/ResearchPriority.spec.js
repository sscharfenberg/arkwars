/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import Vuex from "vuex";
import VueI18n from "vue-i18n";
import {shallow, createLocalVue} from "@vue/test-utils";
import ResearchPriority from "./ResearchPriority.vue";

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
            research: {priority: {label: "Forschungspriorität", costs: "Kosten", "work": "Arbeit"}}
        }
    }
});
const store = new Vuex.Store({
    state: {},
    getters: {
        player: function() { return {researchPriority: 3, totalPopulation: 10}; },
        isChangingResearchPriority: function() { return false; }
    }
});

/*
 * test suite
 */
describe("QueueItem.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(ResearchPriority, {
            localVue,
            i18n,
            store,
            changePriority: function() { return false; }
        });
    });

    it("is a vue instance", () => {
        expect(cmp.isVueInstance()).toBeTruthy();
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("calculates the correct cost and work after recieving population and priority", () => {
        expect(cmp.vm.calculatedCosts).toBe(30);
        expect(cmp.vm.calculatedWork).toBe(25);
    });

});
