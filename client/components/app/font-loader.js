/** ********************************************************************************************************************
 *
 *  Font Loading
 *
 *  @type Module
 *  uses font face observer events to check if the fonts have loaded,
 *  then assign body class to swith to correct font styles
 *
 ******************************************************************************************************************** */
import FontFaceObserver from "fontfaceobserver";
import {DEBUG} from "../../config";

let switchToLoaded = () => {
    document.querySelector("body").classList.add("fonts-loaded");
    DEBUG && console.log("fonts have been applied.");
};

export default () => {
    // Optimization for Repeat Views
    if (sessionStorage && sessionStorage.foutFontsLoaded) {
        DEBUG && console.log("fonts are (probably) cached.");
        switchToLoaded();
        return;
    }
    let fontA = new FontFaceObserver("Roboto");
    Promise.all([fontA.load()]).then(function() {
        DEBUG && console.log("fonts have loaded.");
        switchToLoaded();
        sessionStorage.foutFontsLoaded = true;
    });
};
