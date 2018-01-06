/***********************************************************************************************************************
 *
 * Empire entrypoint
 *
 **********************************************************************************************************************/
import Vue from "vue";
import VueI18n from "vue-i18n";
import store from "../store/store";
import Empire from "./Empire.vue";
import {getAreaMessages} from "../handlers/messages";
import {getLocale, getAreaSlug, getMessagesVersion} from "../handlers/gameConstants";

if (document.getElementById("gameRoot")) {
    const locale = getLocale();
    Vue.use(VueI18n);
    getAreaMessages(locale, getAreaSlug(), getMessagesVersion(), messages => {
        let i18nConfig = {
            locale: locale,
            messages: {}
        };
        i18nConfig.messages[locale] = messages;
        const i18n = new VueI18n(i18nConfig);
        new Vue({
            el: "#gameRoot",
            store,
            i18n,
            template: "<Empire/>",
            components: {Empire},
            beforeCreate: function() {
                return this.$store.dispatch("FETCH_GAMEDATA_FROM_API");
            }
        });
    });
}
