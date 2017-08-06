import fontLoader from "./components/app/font-loader";
import { initSubmenus } from "./components/app/header";
import { initDrawer } from "./components/app/drawer";
import { initJumpToTop } from "./components/app/footer";
import { initFlashMessages } from "./components/app/flash";
import { initTime } from "./components/game/time";
import { initFileUploadFields } from "./components/app/file-upload";

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
initFlashMessages();
initFileUploadFields();
