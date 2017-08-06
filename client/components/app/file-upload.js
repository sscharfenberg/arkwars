/** ********************************************************************************************************************
 *
 * flash messages
 * @exports {function} initFlashMessages
 *
 **********************************************************************************************************************/
import cfg from "../../config";
const SELECTOR_INPUTS = "input[type=file]";


/*
 * get text node from input ============================================================================================
 * @param {Node} input - the file input
 * @returns {Node} span
 */
const getTextNode = input => {
    let label = input.parentNode;
    let span;
    if (label.nodeName === "LABEL") {
        // parent of input should be <label>
        for (let labelChild of label.childNodes) {
            if (labelChild.nodeName === "SPAN") {
                // one of label children should be <span>
                span = labelChild;
            }
        }
    }
    return span;
};


/*
 * initialize file upload fields =======================================================================================
 */
const initFileUploadFields = () => {
    const inputs = document.querySelectorAll(SELECTOR_INPUTS);
    let num = 0;
    // return if no inputs
    if (!inputs) return;
    for (let input of inputs) {
        let text = getTextNode(input);
        if (input && text) {
            num++;
            input.addEventListener("change", function() {
                text.textContent = this.value.split("\\").pop();
            });
        }
    }
    cfg.DEBUG && console.log(`bound ${num} event listeners for file uploads.`);
};


export { initFileUploadFields };
