/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import VueI18n from "vue-i18n";
import Vuex from "vuex";
import {shallow, createLocalVue} from "@vue/test-utils";
import Costs from "./Costs.vue";
/*
 * mock data
 */
const localVue = createLocalVue();
localVue.use(VueI18n);
localVue.use(Vuex);
const i18n = new VueI18n({
    locale: "de",
    messages: {
        de: {
            common: {
                costs: {label: "Kosten", ariaLabel: "Kosten {type}"},
                resourceTypes: {
                    energy: "Energie",
                    food: "Nahrung",
                    minerals: "Mineralien",
                    research: "Forschung",
                    turns: "Runden"
                }
            }
        }
    }
});
const store = new Vuex.Store({
    state: {},
    getters: {
        playerResources() {
            return [
                {type: "energy", current: 500, max: 1000},
                {type: "food", current: 500, max: 1000},
                {type: "minerals", current: 500, max: 1000},
                {type: "research", current: 500, max: 1000}
            ];
        }
    }
});

/*
 * test suite
 */
describe("Costs.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(Costs, {
            localVue,
            i18n,
            store,
            propsData: {
                costs: [{resourceType: "minerals", amount: 124}]
            }
        });
    });

    it("is a vue instance", () => {
        expect(cmp.isVueInstance()).toBeTruthy();
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("shows if resource type is unaffordable", () => {
        cmp.setProps({
            costs: [
                {resourceType: "food", amount: 501},
                {resourceType: "research", amount: 500},
                {resourceType: "energy", amount: 1001}
            ]
        });
        expect(cmp.findAll(".affordable").length).toBe(1);
        expect(cmp.findAll(".insufficient-funds").length).toBe(2);
    });

    it("shows turn costs correctly", () => {
        cmp.setProps({
            costs: [
                {resourceType: "turns", amount: 7},
                {resourceType: "research", amount: 500},
                {resourceType: "energy", amount: 501}
            ]
        });
        expect(cmp.findAll(".cost").at(0).text()).toBe("7");
        expect(cmp.findAll(".cost").at(0).attributes()["aria-label"]).toBe("Kosten Runden");
        expect(cmp.findAll(".insufficient-funds").length).toBe(1);
    });

    it("treats empty costs array correctly by outputting nothing", () => {
        cmp.setProps({costs: []});
        expect(cmp.findAll("ul").length).toBe(0);
        expect(cmp.findAll("li").length).toBe(0);
    });

    it("does not show affordable/not affordable if showAffordable=false", () => {
        cmp.setProps({
            costs: [{resourceType: "research", amount: 2500}],
            showAffordable: false
        });
        expect(cmp.findAll(".affordable").length).toBe(0);
        expect(cmp.findAll(".insufficient-funds").length).toBe(0);
    });
});
