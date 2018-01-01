import Vue from "vue";
import Empire from "./Empire.vue";
import {loadTextStringsFromCache} from "../handlers/texts";
import store from "../store/store";

const AREA = "empire";
const LANGUAGE =
    document.querySelector("body").getAttribute("data-locale") || "";

if (document.getElementById("gameRoot")) {
    console.log(`starting game, language ${LANGUAGE.toUpperCase()}`);
    const serverTextVersion = document
        .getElementById("gameData")
        .getAttribute("data-textversion");
    loadTextStringsFromCache(LANGUAGE, AREA, serverTextVersion, text => {
        console.log("texts are now available.", text);
        Vue.prototype.$txt = text;
        new Vue({
            el: "#gameRoot",
            store,
            template: "<Empire/>",
            components: {Empire}
        });
    });
}
