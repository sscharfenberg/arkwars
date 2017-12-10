import Vue from "vue";
import Empire from "./Empire.vue";

if (document.getElementById("appRoot")) {
    new Vue({
        el: "#appRoot",
        template: "<Empire/>",
        components: {Empire}
    });
}
