/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import VueI18n from "vue-i18n";
import {shallow, createLocalVue} from "@vue/test-utils";
import StorageLevels from "./StorageLevels.vue";

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
                header: {
                    storageUpgrades: {
                        label: "{num} Lager Erweiterungen installiert"
                    }
                }
            }
        }
    }
});

/*
 * test suite
 */
describe("StorageLevels.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(StorageLevels, {
            localVue,
            i18n,
            propsData: {
                level: 3
            }
        });
    });

    it("is a vue instance", () => {
        expect(cmp.isVueInstance()).toBeTruthy();
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("shows the correct amount of active bubbles", () => {
        expect(cmp.findAll(".upgrade.active").length).toBe(3);
        cmp.setProps({level: 0});
        expect(cmp.findAll(".upgrade.active").length).toBe(0);
        expect(cmp.findAll(".upgrade").length).toBe(4);
    });
});
