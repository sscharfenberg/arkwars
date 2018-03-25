<script>
/***********************************************************************************************************************
 * shows the research queue
 **********************************************************************************************************************/
import draggable from "vuedraggable";
import QueueItem from "./QueueItem.vue";
import AbortResearch from "./AbortResearch.vue";
import ScreenSection from "Game/common/ScreenSection/ScreenSection.vue";
import ResearchPriority from "./ResearchPriority.vue";
export default {
    components: {
        draggable,
        QueueItem,
        AbortResearch,
        ScreenSection,
        ResearchPriority
    },
    computed: {
        researches: {
            get() { return this.$store.getters.playerResearches; },
            set(value) { this.$store.dispatch("CHANGE_RESEARCH_ORDER", value); }
        },
        isChangingOrder () { return this.$store.getters.isChangingResearchOrder; }
    }
};
</script>

<template>
    <screen-section
        v-if="researches.length"
        :hdl="$t('queue.label')">
        <research-priority />
        <draggable
            v-if="researches.length"
            v-model="researches"
            :options="{disabled: isChangingOrder}">
            <queue-item
                v-for="research in researches"
                :key="research.id"
                :research-id="research.id" />
        </draggable>
        <abort-research
            v-for="research in researches"
            :key="research.id"
            :research-id="research.id" />
    </screen-section>
</template>
