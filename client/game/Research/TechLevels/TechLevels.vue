<script>
/***********************************************************************************************************************
 * TechLevels
 * shows a summary of available tech levels
 **********************************************************************************************************************/
import TechLevel from "./TechLevel.vue";
import Enqueue from "./Enqueue.vue";
export default {
    components: {
        TechLevel,
        Enqueue
    },
    computed: {
        techLevels: function () { return this.$store.getters.playerTechLevels; }
    }
};
</script>

<template>
    <section
        v-if="techLevels.length"
        class="all-levels">
        <h2>{{ $t("techLevels.label" ) }}</h2>
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
    </section>
</template>



<style lang="scss" scoped>
    .all-levels {
        margin: 1rem 0;

        @include respond-to("medium") {
            margin-top: 2rem;
        }

        > h2 {
            color: palette("brand", "viking");

            font-weight: 300;
        }
    }

    .techs {
        padding: 0;
        margin: 0;

        list-style: none;
    }
</style>
