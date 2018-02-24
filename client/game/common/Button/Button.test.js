import {shallow} from "vue-test-utils";
import Button from "./Button.vue";

describe("Button.vue", () => {
    let cmp;

    beforeEach(() => {
        cmp = shallow(Button, {propsData: {
            textString: "ButtonTest",
            onClick: function() {}
        }});
    });

    it("has the expected props", () => {
        expect(cmp.vm.textString).toEqual("ButtonTest");
        expect(cmp.find(".btn").attributes().class).toBe("btn btn--text");
    });

    it("has the expected html structure", () => {
        expect(cmp.vm.$el).toMatchSnapshot();
    });

    it("uses class=\"tiny\" for scale=0", () => {
        cmp.setProps({scale: 0});
        expect(cmp.find(".btn").attributes().class).toMatch(/tiny/);
    });

    it("uses class=\"small\" for scale=1", () => {
        cmp.setProps({scale: 1});
        expect(cmp.find(".btn").attributes().class).toMatch(/small/);
    });

    it("uses class=\"large\" for scale=3", () => {
        cmp.setProps({scale: 3});
        expect(cmp.find(".btn").attributes().class).toMatch(/large/);
    });

    it("calls the passed function on click", () => {
        const spy = jest.spyOn(cmp.vm, "onClick");
        cmp.update(); // Forces to re-render, applying changes on template
        cmp.find("button").trigger("click");
        expect(cmp.vm.onClick).toBeCalled();
    });
});
