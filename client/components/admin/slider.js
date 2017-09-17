/** ********************************************************************************************************************
 *
 *  Range input slider
 *  @exports {function} initSliders
 *
 **********************************************************************************************************************/
import noUiSlider from "nouislider";
import cfg from "../../config";
const SELECTOR_SLIDERS = ".aw-slider";
const CLASSNAME_INPUT = "aw-slider__input";

let defaultUiSliderOptions = {
    connect: true,
    orientation: "horizontal",
    step: 1,
    behavior: "tap",
    tooltips: true,
    format: {
        to: number => parseInt(number, 10),
        from: number => parseInt(number, 10)
    },
    pips: {
        // Show a scale with the slider
        mode: "count",
        stepped: true,
        values: 20,
        density: 5
    }
};

const getSliderInputs = slider => {
    const inputs = slider.childNodes;
    let returnList = [];
    for (let input of inputs) {
        if (input.classList.contains(CLASSNAME_INPUT)) returnList.push(input);
    }
    return returnList;
};

/*
 * update the hidden fields after a slider has been changed ============================================================
 * @param {DOMnode} slider
 * @param {array} values
 */
const updateSliderInputs = (slider, values) => {
    const inputs = getSliderInputs(slider);
    inputs.forEach((input, index) => {
        input.value = values[index];
    });
    cfg.DEBUG && console.log(`updated #${slider.id} with values [${values}].`);
};

/*
 * @param {node} slider - DOM node of slider
 */
const initSlider = slider => {
    const inputs = getSliderInputs(slider);
    const min = parseInt(slider.getAttribute("data-min"), 10);
    const max = parseInt(slider.getAttribute("data-max"), 10);
    let sliderOptions = defaultUiSliderOptions;
    let values = [];
    inputs.forEach(input => {
        if (input.classList.contains(CLASSNAME_INPUT)) values.push(input.value);
    });
    sliderOptions.range = {
        min: [min],
        max: [max]
    };
    sliderOptions.start = values;
    console.log(sliderOptions);
    noUiSlider.create(slider, sliderOptions);
    slider.noUiSlider.on("change", function (values) {
        updateSliderInputs(slider, values);
    });
    cfg.DEBUG &&
        console.log(
            `bound #${slider.id} with ${inputs.length} hidden fields and [${values}] as values.`
        );
};

const initSliders = () => {
    const sliders = document.querySelectorAll(SELECTOR_SLIDERS);
    if (!sliders || !sliders.length) return;
    cfg.DEBUG && console.log(`binding ${sliders.length} range inputs.`);
    for (let slider of sliders) initSlider(slider);
};

export { initSliders };
