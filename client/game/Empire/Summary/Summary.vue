<script>
/***********************************************************************************************************************
 * Summary
 * this components shows the summary by including the apropriate sub-components
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import Resources from "./Resources.vue";
import Population from "./Population.vue";

export default {
    computed: {
        resources: function () { return this.$store.getters.playerResources.map(resource => resource.type); }
    },
    components: {
        Icon,
        Resources,
        Population
    }
};
</script>

<template>
    <ul class="stats">
        <resources
            v-if="resources.length"
            v-for="resource in resources"
            :key="resource"
            :res-type="resource" />
        <population />
    </ul>
</template>

<style lang="scss" scoped>
    .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

        padding: 0;
        margin-top: 1rem;
        grid-gap: 1rem;

        list-style: none;

        @include respond-to("medium") {
            margin-top: 2rem;
            grid-gap: 2rem;
        }
    }

    .item {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-wrap: wrap;

        padding: 1rem;
        border: 1px solid palette("grey", "abbey");

        background: palette("grey", "sunken");

        h3 {
            display: flex;
            align-items: center;
            justify-content: center;

            margin: 0 0 1rem 0;
            flex: 0 0 100%;

            font-weight: 300;
            text-align: center;
            text-transform: capitalize;
        }

        svg {
            margin-right: 1rem;
        }
    }
</style>
