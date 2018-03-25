<script>
/***********************************************************************************************************************
 * TechLevels
 * shows a summary of available tech levels
 **********************************************************************************************************************/
import TechLevel from "./TechLevel.vue";
import Enqueue from "./Enqueue.vue";
import ScreenSection from "Game/common/ScreenSection/ScreenSection.vue";
export default {
    components: {
        TechLevel,
        Enqueue,
        ScreenSection
    },
    computed: {
        techLevels: function () { return this.$store.getters.playerTechLevels; }
    }
};
</script>

<template>
    <screen-section
        v-if="techLevels.length"
        class="all-levels"
        :hdl="$t('techLevels.label')">
        <ul class="techs">
            <tech-level
                v-for="techLevel in techLevels"
                :key="techLevel.type"
                :tl-type="techLevel.type"
                :level="techLevel.level" />
        </ul>
        <enqueue
            v-for="techLevel in techLevels"
            :key="techLevel.type"
            :area="techLevel.type"
            :level="techLevel.level" />
    </screen-section>
</template>

<style lang="scss" scoped>
    .techs {
        padding: 0;
        margin: 0;

        list-style: none;
    }
</style>
