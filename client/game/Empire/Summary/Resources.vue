<script>
/***********************************************************************************************************************
 * Resource Stats
 * this components displays the amount of resources gained (energy, food, minerals, research)
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import {harvesterRules} from "Config";
export default {
    props: {
        resType: {
            type: String,
            required: true
        }
    },
    computed: {
        colonies: function () { return this.$store.getters.planets.filter(planet => planet.effectivePopulation > 0); },
        production: function () {
            const baseProduction = harvesterRules.types.find(slot => slot.type === this.resType).baseProduction;
            return this.$store.getters.harvesters
                .filter(harvester => harvester.resourceType === this.resType && harvester.isHarvesting)
                .map(harvester => Math.floor(harvester.resGrade * baseProduction))
                .reduce((accumulator, currentValue) => { return accumulator + currentValue; }, 0);
        },
        foodConsumption: function () {
            return this.$store.getters.planets.filter(planet => planet.effectivePopulation > 0)
                .map(planet => Math.ceil(planet.foodConsumption * planet.population))
                .reduce((accumulator, currentValue) => { return accumulator + currentValue; }, 0);
        },
        numHarvesters: function () {
            return this.$store.getters.harvesters
                .filter(harvester => harvester.resourceType === this.resType && harvester.isHarvesting)
                .length;
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
                :name="`res-${resType}`"
                :size="3" />
            {{ $t("common.resourceTypes." + resType) }}
        </h3>
        <div class="value">
            <span class="highlight">+{{ production }}</span>
            {{ $t("summary.resources.production", {num: numHarvesters}) }}
            <span v-if="resType === 'food'">
                <br>
                <span class="negative">-{{ foodConsumption }}</span>
                {{ $t("summary.resources.foodConsumption") }}
            </span>
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
        .negative { color: palette("state", "error"); }
    }
</style>
