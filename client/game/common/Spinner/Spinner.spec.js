/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import {mount} from "@vue/test-utils";
import Spinner from "./Spinner.vue";

describe("Spinner.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = mount(Spinner);
    });

    it("is a vue instance", () => {
        expect(cmp.isVueInstance()).toBeTruthy();
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("uses depth prop as border-width", () => {
        cmp.setProps({depth: 10});
        expect(cmp.find(".spinner").attributes().style).toMatch(/border-width: 10px/);
    });

    it("is not visible if status=false", () => {
        expect(cmp.find(".spinner").isVisible()).toBeTruthy();
        cmp.setProps({status: false});
        expect(cmp.find(".spinner").isVisible()).toBeFalsy();
    });
});
