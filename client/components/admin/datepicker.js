/** ********************************************************************************************************************
 *
 *  DateTimePicker - wrapper for flatpickr
 *  @exports {function} initSliders
 *
 **********************************************************************************************************************/
import flatpickr from "flatpickr";
import moment from "moment";
import cfg from "../../config";
const SELECTOR_DATEPICKERS = ".admin-datetimepicker";



const initFlatPickr = element => {
    let elements = element.parentNode.childNodes;
    let hiddenField;
    for (let child of elements) {
        if (child.getAttribute("type") === "hidden") {
            hiddenField = child;
        }
    }
    flatpickr(element, {
        enableTime: true,
        dateFormat: "d.m.Y H:i",
        time_24hr: true,
        minuteIncrement: 15,
        onChange: function(selectedDates, dateStr) { // dateStr, instance available as well
            hiddenField.value = moment(selectedDates[0]).toISOString();
            cfg.DEBUG && console.log(`datepicker #${element.id}: updated hidden field to ${dateStr} as ISO.`);
        }
    });
};



const initDatePickers = () => {
    const datepickers = document.querySelectorAll(SELECTOR_DATEPICKERS);
    if (!datepickers || !datepickers.length) return;
    cfg.DEBUG && console.log(`binding ${datepickers.length} datepickers.`);
    for (let datepicker of datepickers) initFlatPickr(datepicker);
};

export { initDatePickers };
