<script>
/***********************************************************************************************************************
 * Population
 * shows total population over all colonies
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
export default {
    computed: {
        colonies: function () { return this.$store.getters.planets.filter(planet => planet.effectivePopulation > 0); },
        totalPop: function() {
            if (this.colonies.length === 0) return 0;
            return this.colonies.map(planet => planet.effectivePopulation)
                .reduce((accumulator, currentValue) => { return accumulator + currentValue; }, 0 );
        }
    },
    components: {
        Icon
    }
};
</script>

<template>
    <li class="item">
        <h3>
            <icon
                class="icon"
                name="population"
                :size="3" />
            {{ $t("summary.population.label") }}
        </h3>
        <div class="value">
            <span class="highlight">{{ totalPop }}</span>
            {{ $t("summary.population.value", {numColonies: colonies.length}) }}
        </div>
    </li>
</template>

<style lang="scss" scoped>
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

    .item > .value {
        text-align: center;

        .highlight { color: palette("state", "success"); }
    }
</style>
