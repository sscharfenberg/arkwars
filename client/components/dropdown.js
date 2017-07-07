/** ********************************************************************************************************************
 *
 *  Header dropdown menues. very basic
 *
 ******************************************************************************************************************** */
const SELECTOR_SUBMENU = ".aw-header__submenu";
const SELECTOR_SUBMENU_TRIGGER = ".aw-header__submenu-trigger";
const CLASSNAME_OPEN = "aw-header__link--active";
const CLASSNAME_OPENING = "aw-header__link--opening";
const CLASSNAME_CLOSING = "aw-header__link--closing";
const ANIMATION_DURATION = 150; // needs to by synched to css value of @keyframes "openSubmenu" and "closeSubmenu"

/*
 * @function hide a submenu by link
 * @param {DOMNode} node - link that should be manipulated.
 */
const hide = node => {
    node.classList.add(CLASSNAME_CLOSING);
    setTimeout(() => {
        node.classList.remove(CLASSNAME_OPEN, CLASSNAME_CLOSING);
        getSubmenuByLink(node).setAttribute("aria-hidden", "true");
    }, ANIMATION_DURATION);
};

/*
 * @function show a submenu by link
 * @param {DOMNode} node - link that should be manipulated.
 */
const show = node => {
    node.classList.add(CLASSNAME_OPEN, CLASSNAME_OPENING);
    setTimeout(() => {
        node.classList.remove(CLASSNAME_OPENING);
        getSubmenuByLink(node).setAttribute("aria-hidden", "false");
    }, ANIMATION_DURATION);
};

/*
 * @function get submenu by link
 * @param {DOMNode} link - DOMNode of the link
 * @return {DOMNode} submenu
 */
const getSubmenuByLink = link => {
    return link.parentNode.childNodes[1];
};

/*
 * @function initialize dropdowns
 */
const initializeDropdowns = () => {
    const submenus = document.querySelectorAll(SELECTOR_SUBMENU);
    const triggers = document.querySelectorAll(SELECTOR_SUBMENU_TRIGGER);

    // only initialize if there are submenus, triggers and a trigger for each submenu.
    if (
        submenus.length !== triggers.length || // only check sums to avoid overhead
        submenus.length === 0 ||
        triggers.length === 0
    )
        return;

    for (let i = 0; i < triggers.length; i++) {
        // click event handler for each submenu trigger
        triggers[i].onclick = function(ev) {
            let openMenuLinks = document.querySelectorAll("." + CLASSNAME_OPEN);
            ev.preventDefault();
            if (!this.classList.contains(CLASSNAME_OPEN)) {
                if (openMenuLinks.length > 0) { // if there where open menus before click
                    for (let j = 0; j < openMenuLinks.length; j++) { // loop open menus
                        hide(openMenuLinks[j]); // and hide them
                    }
                }
                show(this); // show this submenu
            } else {
                hide(this); // hide this submenu
            }
        };
    }
};

export default initializeDropdowns;
