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

let switchToLoaded = () => {
    document.querySelector("body").classList.add("fonts-loaded");
};

export default () => {
    // Optimization for Repeat Views
    if( sessionStorage && sessionStorage.foutFontsLoaded ) {
        switchToLoaded();
        return;
    }
    let fontA = new FontFaceObserver("Roboto");
    Promise.all([fontA.load()]).then(function() {
        console.log("fonts have loaded");
        switchToLoaded();
        sessionStorage.foutFontsLoaded = true;
    });
};
