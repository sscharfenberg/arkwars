/** ********************************************************************************************************************
 *
 * flash messages
 * @exports {function} initFlashMessages
 *
 **********************************************************************************************************************/
const SELECTOR_FLASHES = ".aw-flash";
const SELECTOR_BUTTONS = ".aw-flash__remove";
const CLASS_ERROR = "aw-flash__message--error";

const initFlashMessages = () => {
    const flashes = document.querySelectorAll(SELECTOR_FLASHES);
    const buttons = document.querySelectorAll(SELECTOR_BUTTONS);

    // return if no flashes or no buttons
    if (!flashes || !buttons) return;

    for (let button of buttons) {
        const message = button.parentElement;
        button.addEventListener("click", function() {
            message.parentElement.remove();
        });
        if (!message.classList.contains(CLASS_ERROR)) {
            setTimeout(() => {
                message.parentElement.remove();
            }, 1000 * 10);
        }
    }

};

export { initFlashMessages };
