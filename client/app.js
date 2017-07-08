//import moment from "moment";
//import "moment/locale/de"; // import the locale even though webpack ignores moment/locale
import fontLoader from "./components/app/font-loader";
import { initSubmenus } from "./components/app/header";
import { initDrawer } from "./components/app/drawer";
import { initJumpToTop } from "./components/app/footer";

//moment.locale("de");
//console.log(moment().format("dddd, DD.MM.YYYY HH:mm:ss"));
//let componentsToMount = document.querySelectorAll(".aw-component");
//console.log( componentsToMount );

fontLoader();

// component checks if it needs to be initialized and returns if not.
initSubmenus();

initDrawer();

initJumpToTop();
