<script>
/***********************************************************************************************************************
 * shows the research queue
 **********************************************************************************************************************/
import draggable from "vuedraggable";
import QueueItem from "./QueueItem.vue";
import AbortResearch from "./AbortResearch.vue";
export default {
    components: {
        draggable,
        QueueItem,
        AbortResearch
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
    <section>
        <h2>{{ $t("queue.label") }}</h2>
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
    </section>
</template>

<style lang="scss" scoped>
    h2 {
        color: palette("brand", "viking");

        font-weight: 300;
    }
</style>
