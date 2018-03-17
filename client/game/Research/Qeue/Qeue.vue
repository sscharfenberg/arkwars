<script>
/***********************************************************************************************************************
 * shows the research qeue
 **********************************************************************************************************************/
import draggable from "vuedraggable";
import QeueItem from "./QeueItem.vue";
export default {
    components: {
        draggable,
        QeueItem
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
        <h2>Research Qeue</h2>
        <draggable
            v-if="researches.length"
            v-model="researches">
            <qeue-item
                v-for="research in researches"
                :key="research.id"
                :research-id="research.id" />
        </draggable>
    </section>

</template>

<style lang="scss" scoped>
    h2 {
        color: palette("brand", "viking");

        font-weight: 300;
    }
</style>
