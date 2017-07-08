/** ********************************************************************************************************************
 *
 * drawer with left navigation
 * @exports {function} initializeDrawer
 *
 **********************************************************************************************************************/
import cfg from "../../config";
import { loadSettings, saveSettings } from "./settings";

const SELECTOR_DRAWER = ".aw-drawer";
const SELECTOR_DRAWER_BUTTON = ".aw-header__menu-btn";
const CLASSNAME_OPEN = "aw-drawer--open";
const CLASSNAME_BTN_OPEN = "aw-header__menu-btn--open";
const CLASSNAME_OPENING = "aw-drawer--opening";
const CLASSNAME_CLOSING = "aw-drawer--closing";
// needs to by synched to css value of @keyframes "openDrawer" and "closeDrawer" in theme/components/app/_drawer.scss
const ANIMATION_DURATION = 150;

/*
 * @function open the drawer
 * @param {DOMNode} drawer
 * @param {DOMNode} button
 */
const openDrawer = (drawer, button) => {
    let settings = loadSettings(cfg.LOCALSTORAGE_KEY);
    drawer.classList.add(CLASSNAME_OPENING);
    cfg.DEBUG && console.log("opening drawer");
    setTimeout(() => {
        drawer.classList.remove(CLASSNAME_OPENING);
        drawer.classList.add(CLASSNAME_OPEN);
        button.classList.add(CLASSNAME_BTN_OPEN);
        settings.drawerOpen = true;
        saveSettings(cfg.LOCALSTORAGE_KEY, settings);
    }, ANIMATION_DURATION);
};

/*
 * @function close the drawer
 * @param {DOMNode} drawer
 * @param {DOMNode} button
 */
const closeDrawer = (drawer, button) => {
    let settings = loadSettings(cfg.LOCALSTORAGE_KEY);
    drawer.classList.add(CLASSNAME_CLOSING);
    button.classList.remove(CLASSNAME_BTN_OPEN);
    cfg.DEBUG && console.log("closing drawer");
    setTimeout(() => {
        drawer.classList.remove(CLASSNAME_OPEN, CLASSNAME_CLOSING);
        settings.drawerOpen = false;
        saveSettings(cfg.LOCALSTORAGE_KEY, settings);
    }, ANIMATION_DURATION);
};

const initDrawer = () => {
    const drawer = document.querySelector(SELECTOR_DRAWER);
    const button = document.querySelector(SELECTOR_DRAWER_BUTTON);
    let settings = loadSettings(cfg.LOCALSTORAGE_KEY);

    // return if no drawer or no trigger
    if (!drawer || !button) return;

    // open drawer if localStorage says so.
    if (settings.drawerOpen) {
        cfg.DEBUG && console.log("opening drawer because of settings.");
        drawer.classList.add(CLASSNAME_OPEN);
        button.classList.add(CLASSNAME_BTN_OPEN);
    }

    // click event
    button.addEventListener("click", function() {
        if (drawer.classList.contains(CLASSNAME_OPEN)) {
            closeDrawer(drawer, button);
        } else {
            openDrawer(drawer, button);
        }
    });
};

export { initDrawer };
