/** ********************************************************************************************************************
 *
 * drawer with left navigation
 * @exports {function} initializeDrawer
 *
 **********************************************************************************************************************/
const ID_JUMPTOPLINK = "footerJumpTop";
const ID_SCROLL_AREA = "content";


const initJumpToTop = () => {
    const link = document.getElementById(ID_JUMPTOPLINK);
    const scrollArea = document.getElementById(ID_SCROLL_AREA);

    // fail silently if there is no jump link or scroll area
    if (!link || !scrollArea) return;

    link.addEventListener("click", function(ev) {
        ev.preventDefault();
        scrollArea.scrollTop = 0;
    });

};

export {initJumpToTop};
