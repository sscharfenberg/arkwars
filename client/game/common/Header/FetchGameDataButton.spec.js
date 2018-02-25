/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import VueI18n from "vue-i18n";
import Vuex from "vuex";
import {shallow, createLocalVue} from "@vue/test-utils";
import FetchGameDataButton from "./FetchGameDataButton.vue";
/*
 * mock data
 */
const localVue = createLocalVue();
localVue.use(VueI18n);
localVue.use(Vuex);
const i18n = new VueI18n({
    locale: "de",
    messages: {de: {common: {header: {refreshGameDataBtn: {fetching: "fetching", fetch: "fetch"}}}}}
});
const store = new Vuex.Store({
    state: {},
    getters: {
        fetchingGameDataFromApi() { return false; }
    }
});

/*
 * test suite
 */
describe("Costs.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(FetchGameDataButton, {
            localVue,
            i18n,
            store,
            propsData: {area: "empire"}
        });
    });

    it("is a vue instance", () => {
        expect(cmp.isVueInstance()).toBeTruthy();
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("calls the click function", () => {
        cmp.setMethods({fetchGameData: jest.fn()});
        const spy = jest.spyOn(cmp.vm, "fetchGameData");
        cmp.update(); // Forces to re-render, applying changes on template
        cmp.find("button").trigger("click");
        expect(cmp.vm.fetchGameData).toBeCalled();
    });
});
