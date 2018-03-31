/** ********************************************************************************************************************
 *
 * drawer with left navigation
 * @exports {function} initializeDrawer
 *
 **********************************************************************************************************************/
import axios from "axios";
import {DEBUG} from "../../config";

const SELECTOR_DRAWER = "appDrawer";
const SELECTOR_DRAWER_BUTTON = "appDrawerBtn";
const CLASSNAME_OPEN = "aw-drawer--open";
const CLASSNAME_BTN_OPEN = "aw-header__menu-btn--open";
const CLASSNAME_OPENING = "aw-drawer--opening";
const CLASSNAME_CLOSING = "aw-drawer--closing";
// needs to by synched to css value of @keyframes "openDrawer" and "closeDrawer" in theme/components/app/_drawer.scss
const ANIMATION_DURATION = 150;

/*
 * simple non-trusted way to find out if the user is logged in.
 * this is purely to avoid error messages from the server
 */
const isLoggedIn = () => document.querySelector("body").getAttribute("data-user") === "1";

/*
 * simple way to find out if the drawer covers the content (<768px width) or pushes it to the side (>= 768opx)
 * remembering that the drawer is open is totes awesome for clients with enough viewport width
 * it is not helping if the drawer covers the content anyway - navigation would be very awkward,
 * since you would have to close the drawer again
 */
const isSmallViewPort = () => window.innerWidth < 768;

/*
 * @function open the drawer
 * @param {DOMNode} drawer
 * @param {DOMNode} button
 */
const openDrawer = (drawer, button) => {
    drawer.classList.add(CLASSNAME_OPENING);
    button.classList.add(CLASSNAME_BTN_OPEN);
    DEBUG && console.log("opening drawer");
    setTimeout(() => {
        drawer.classList.remove(CLASSNAME_OPENING);
        drawer.classList.add(CLASSNAME_OPEN);
        drawer.setAttribute("aria-hidden", "false");
        isLoggedIn() && !isSmallViewPort() &&
            axios
                .post("/api/user/opendrawer")
                .then(response => {
                    if (response.data.status === "success") {
                        DEBUG && console.log("saved drawer setting in db.");
                    } else {
                        DEBUG && console.error(`error while saving to database: ${response}`);
                    }
                })
                .catch(error => {
                    DEBUG && console.error(error);
                });
    }, ANIMATION_DURATION);
};

/*
 * @function close the drawer
 * @param {DOMNode} drawer
 * @param {DOMNode} button
 */
const closeDrawer = (drawer, button) => {
    drawer.classList.add(CLASSNAME_CLOSING);
    button.classList.remove(CLASSNAME_BTN_OPEN);
    DEBUG && console.log("closing drawer");
    setTimeout(() => {
        drawer.classList.remove(CLASSNAME_OPEN, CLASSNAME_CLOSING);
        drawer.setAttribute("aria-hidden", "true");
        isLoggedIn() && !isSmallViewPort() &&
            axios
                .post("/api/user/closedrawer")
                .then(response => {
                    if (response.data.status === "success") {
                        DEBUG && console.log("saved drawer setting in db.");
                    } else {
                        DEBUG && console.error(`error while saving to database: ${response}`);
                    }
                })
                .catch(error => {
                    DEBUG && console.error(error);
                });
    }, ANIMATION_DURATION);
};

/*
 * initialize drawer by binding event listeners
 */
const initDrawer = () => {
    const drawer = document.getElementById(SELECTOR_DRAWER);
    const button = document.getElementById(SELECTOR_DRAWER_BUTTON);

    // return if no drawer or no trigger
    if (!drawer || !button) return;

    // for smaller screens, remove open class since it covers part of the content anyway
    if (isSmallViewPort()) drawer.classList.remove(CLASSNAME_OPEN);

    // click event
    button.addEventListener("click", function() {
        if (drawer.classList.contains(CLASSNAME_OPEN)) {
            closeDrawer(drawer, button);
        } else {
            openDrawer(drawer, button);
        }
    });
};

/*
 * public export
 */
export {initDrawer};
