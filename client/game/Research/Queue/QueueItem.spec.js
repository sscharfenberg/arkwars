/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import Vuex from "vuex";
import VueI18n from "vue-i18n";
import {shallow, createLocalVue} from "@vue/test-utils";
import QueueItem from "./QueueItem.vue";

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
            research: {start: "TL{tl} Erforschen", abort: "Forschung Abbrechen"}
        }
    }
});
const store = new Vuex.Store({
    state: {},
    getters: {
        isChangingResearchOrder: function() { return false; },
        researchById: function(id) {
            return function(id) {
                return {
                    id,
                    area: "laser",
                    newLevel: 5,
                    remaining: 1400,
                    icon: "wpn-laser",
                    order: 0
                };
            };
        }
    }
});

/*
 * test suite
 */
describe("QueueItem.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(QueueItem, {
            localVue,
            i18n,
            store,
            propsData: {
                researchId: "0123456789abcdef"
            }
        });
    });

    it("is a vue instance", () => {
        expect(cmp.isVueInstance()).toBeTruthy();
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("calculates the correct progress", () => {
        expect(cmp.vm.label).toBe("Laser TL5 32%"); // 2048 max, 648 done => 31.64
    });

});
