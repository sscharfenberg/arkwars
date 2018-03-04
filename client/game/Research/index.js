/***********************************************************************************************************************
 *
 * Research entrypoint
 *
 **********************************************************************************************************************/
import Vue from "vue";
import VueI18n from "vue-i18n";
import Vuelidate from "vuelidate";
import VModal from "vue-js-modal";
import Snotify, {SnotifyPosition} from "vue-snotify";
import store from "./store";
import Research from "./Research.vue";
import {DEBUG} from "Config";
import {getAreaMessages} from "../handlers/messages";
import {getLocale, getAreaSlug, getMessagesVersion} from "../handlers/gameConstants";

if (document.getElementById("gameRoot")) {
    const locale = getLocale();
    Vue.use(VueI18n);
    Vue.use(Vuelidate);
    Vue.use(VModal);
    Vue.use(Snotify, {
        toast: {
            position: SnotifyPosition.rightTop,
            timeout: 4000
        }
    });
    DEBUG && console.log(`bootstrapping VueJS, locale ${locale}.`);
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
            template: "<Research/>",
            components: {Research},
            beforeCreate: function() {
                return this.$store.dispatch("FETCH_GAMEDATA_FROM_API", {area: getAreaSlug()});
            }
        });
    });
}
