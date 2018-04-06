<script>
/*******************************************************************************************************************
 * Empire (entry) Component
 ******************************************************************************************************************/
import Header from "Game/common/Header/Header.vue";
import Stars from "./Stars/Stars.vue";
import Summary from "./Summary/Summary.vue";
import ScreenSection from "Game/common/ScreenSection/ScreenSection.vue";
//import {shipyardRules} from "Config";
export default {
    components: {
        "app-header": Header,
        Stars,
        Summary,
        ScreenSection
    }
};
</script>

<template>
    <div>
        <app-header
            :area-title="$t('title')"
            area="empire" />
        <screen-section>
            <Summary />
        </screen-section>
        <screen-section :hdl="$t('stars')">
            <Stars />
        </screen-section>
        <vue-snotify />
        TODO: reports - here or in galnet? show citadel?
    </div>
</template>

<style lang="scss">
    @import "~vue-snotify/styles/dark";
    @import "~Theme/components/game/input-range";
    @import "~Theme/components/game/vuejs-modal";
</style>
