import fontLoader from "./components/app/font-loader";
import { initSubmenus } from "./components/app/header";
import { initDrawer } from "./components/app/drawer";
import { initJumpToTop } from "./components/app/footer";
import { initTime } from "./components/game/time";

//moment.locale("de");
//console.log(moment().format("dddd, DD.MM.YYYY HH:mm:ss"));
//let componentsToMount = document.querySelectorAll(".aw-component");
//console.log( componentsToMount );

fontLoader();

// component checks if it needs to be initialized and returns if not.
initSubmenus();

initDrawer();

initJumpToTop();

initTime();
