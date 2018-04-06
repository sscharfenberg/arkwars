<script>
/***********************************************************************************************************************
 * Research (entry) Component
 **********************************************************************************************************************/
import Header from "Game/common/Header/Header.vue";
import TechLevels from "./TechLevels/TechLevels.vue";
import ResearchPriority from "./ResearchPriority/ResearchPriority.vue";
import Queue from "./Queue/Queue.vue";
export default {
    components: {
        "app-header": Header,
        TechLevels,
        Queue,
        ResearchPriority
    }
};
</script>

<template>
    <div>
        <app-header
            :area-title="$t('title')"
            area="research" />
        <research-priority />
        <queue />
        <tech-levels />
        <vue-snotify />
    </div>
</template>

<style lang="scss">
    @import "~vue-snotify/styles/dark";
    @import "~Theme/components/game/input-range";
    @import "~Theme/components/game/vuejs-modal";
</style>
