<script>
/***********************************************************************************************************************
 * Shipyards (entry) Component
 **********************************************************************************************************************/
import Header from "Game/common/Header/Header.vue";
import ScreenSection from "Game/common/ScreenSection/ScreenSection.vue";
import Summary from "./Summary/Summary.vue";
import SectionSwitcher from "./Summary/SectionSwitcher.vue";
import DesignSection from "./Design/DesignSection.vue";
import ConstructSection from "./Construct/ConstructSection.vue";
export default {
    components: {
        ScreenSection,
        SectionSwitcher,
        "app-header": Header,
        "shipyard-summary": Summary,
        DesignSection,
        ConstructSection
    },
    computed: {
        currentSection () { return this.$store.getters.userSettings.shipyards.selectedSection; }
    }
};
</script>

<template>
    <div>
        <app-header
            :area-title="$t('title')"
            area="shipyards" />
        <screen-section class="meta">
            <shipyard-summary />
            <section-switcher />
        </screen-section>
        <design-section v-if="currentSection === 'design'" />
        <construct-section v-if="currentSection === 'construct'" />
    </div>
</template>

<style lang="scss">
    @import "~vue-snotify/styles/dark";
    @import "~Theme/components/game/input-range";
    @import "~Theme/components/game/vuejs-modal";
</style>

<style lang="scss" scoped>
    .meta {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;

        padding: 0.5rem;

        background: palette("grey", "sunken");

        @include respond-to("medium") {
            flex-direction: row;

            padding: 1rem;
        }
    }
</style>
