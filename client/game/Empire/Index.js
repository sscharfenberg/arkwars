/***********************************************************************************************************************
 *
 * Empire entrypoint
 *
 **********************************************************************************************************************/
import Vue from "vue";
import VueI18n from "vue-i18n";
import Vuelidate from "vuelidate";
import VModal from "vue-js-modal";
import store from "./store";
import Empire from "./Empire.vue";
import cfg from "Config";
import {getAreaMessages} from "../handlers/messages";
import {getLocale, getAreaSlug, getMessagesVersion} from "../handlers/gameConstants";

if (document.getElementById("gameRoot")) {
    const locale = getLocale();
    Vue.use(VueI18n);
    Vue.use(Vuelidate);
    Vue.use(VModal, { dialog: true });
    cfg.DEBUG && console.log(`bootstrapping VueJS, locale ${locale}.`);
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

