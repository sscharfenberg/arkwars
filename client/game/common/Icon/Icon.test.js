import {mount} from "vue-test-utils";
import Icon from "./Icon.vue";

describe("Icon.test.js", () => {
    let cmp;

    beforeEach(() => {
        cmp = mount(Icon, {propsData: {name: "sync", size: 3}});
    });

    it("has the expected prop", () => {
        expect(cmp.vm.name).toEqual("sync");
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it('uses class="large" size=3', () => {
        expect(cmp.find("svg").attributes().class).toMatch(/large/);
    });
});
