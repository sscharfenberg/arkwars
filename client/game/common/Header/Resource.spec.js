/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import VueI18n from "vue-i18n";
import {shallow, createLocalVue} from "@vue/test-utils";
import Resource from "./Resource.vue";

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
                resourceTypes: {
                    label: "label",
                    energy: "Energie",
                    food: "Nahrung",
                    minerals: "Mineralien",
                    research: "Forschung",
                    turns: "Runden"
                },
                header: {
                    storageUpgrades: {
                        buttonAriaLabel: "Click to show info"
                    }
                }
            }
        }
    }
});

/*
 * test suite
 */
describe("Resource.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(Resource, {
            localVue,
            i18n,
            propsData: {
                type: "energy",
                current: 140,
                max: 500,
                storageLevel: 2
            }
        });
    });

    it("is a vue instance", () => {
        expect(cmp.isVueInstance()).toBeTruthy();
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("calculates values correctly", () => {
        expect(cmp.find(".res__bar").attributes()["aria-valuenow"]).toBe("28");
        expect(cmp.find(".res__amount").text()).toBe("140 / 500 (28%)");
    });
});
