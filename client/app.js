//import moment from "moment";
//import "moment/locale/de"; // import the locale even though webpack ignores moment/locale
import fontLoader from "./components/font-loader";
import dropdown from "./components/dropdown";



//moment.locale("de");
//console.log(moment().format("dddd, DD.MM.YYYY HH:mm:ss"));
//let componentsToMount = document.querySelectorAll(".aw-component");
//console.log( componentsToMount );


fontLoader();

dropdown();
