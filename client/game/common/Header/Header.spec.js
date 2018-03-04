/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import Vuex from "vuex";
import {shallow, createLocalVue} from "@vue/test-utils";
import Header from "./Header.vue";
/*
 * mock data
 */
const localVue = createLocalVue();
localVue.use(Vuex);
const store = new Vuex.Store({
    state: {},
    getters: {
        playerResources() {
            return [{type: "energy", current: 100, max: 1000}];
        },
        player() {
            return {
                name: "123ABC456",
                ticker: "DUDE"
            };
        }
    }
});

/*
 * test suite
 */
describe("Costs.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(Header, {
            localVue,
            store,
            propsData: {
                areaTitle: "Empire",
                area: "mockPropClass"
            }
        });
    });

    it("is a vue instance", () => {
        expect(cmp.isVueInstance()).toBeTruthy();
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("uses props.area as class", () => {
        expect(cmp.find(".header").attributes().class).toMatch(/mockPropClass/);
    });
});
