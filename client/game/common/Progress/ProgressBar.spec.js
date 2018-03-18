/***********************************************************************************************************************
 * JEST spec file
 **********************************************************************************************************************/
import {mount} from "@vue/test-utils";
import ProgressBar from "./ProgressBar.vue";

describe("ProgressBar.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = mount(ProgressBar, {propsData: {max: 1500, value: 766, active: true}});
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("calculates and shows the correct values", () => {
        expect(cmp.find(".text").attributes().class).not.toMatch(/hidden/);
        expect(cmp.find(".text").text()).toBe("766 / 1500 (51%)");
    });

    it("renders the correct bar length", () => {
        expect(cmp.find(".remaining").attributes().style).toMatch(/width: 48%/);
    });

    it("drops the \"active\" class if active=\"false\" is passed as prop", () => {
        cmp.setProps({active: false});
        expect(cmp.find(".box").attributes().class).not.toMatch(/active/);
    });

    it("uses \"hidden\" class for text if showText=\"false\" is passed as prop", () => {
        cmp.setProps({showText: false});
        expect(cmp.find(".text").attributes().class).toMatch(/hidden/);
    });

});
