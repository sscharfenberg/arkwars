import moment from "moment";
import "moment/locale/de"; // import the locale even though webpack ignores moment/locale



export default () => {
    moment.locale("de");
    console.log(moment().format("dddd, DD.MM.YYYY HH:mm:ss"));
    let componentsToMount = document.querySelectorAll(".aw-component");
    console.log( componentsToMount );
};
