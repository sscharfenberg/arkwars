<script>
/***********************************************************************************************************************
 * Population
 * this component shows the current effective population
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import Colony from "./Colony.vue";
export default {
    props: {
        planetId: {
            type: String,
            required: true
        },
        starName: {
            type: String,
            required: true
        }
    },
    components: {
        Icon,
        Colony
    },
    computed: {
        effectivePopulation () {
            return this.$store.getters.planetById(this.planetId).effectivePopulation;
        },
        buttonLabel () {
            return this.$t("planet.population.buttonLabel", {
                num: this.$store.getters.planetById(this.planetId).population
            });
        }
    },
    methods: {
        openDetails () { return this.$modal.show(`colony-${this.planetId}`); }
    }
};
</script>

<template>
    <div class="population">
        <button
            :aria-label="buttonLabel"
            :title="buttonLabel"
            @click="openDetails()">
            <icon name="population" />
            {{ effectivePopulation }}
        </button>
        <colony
            :planet-id="planetId"
            :star-name="starName" />
    </div>
</template>

<style lang="scss" scoped>
    button {
        display: flex;
        align-items: center;

        box-sizing: content-box;
        height: 2.6rem;
        padding: 0.5rem 1rem;
        border: 1px solid palette("grey", "abbey");
        margin: 0 0.8rem 0.8rem 0;

        background: rgba(palette("grey", "mystic"), 0.05);
        color: palette("text");

        cursor: pointer;

        font-weight: 300;

        transition:
            background-color map-get($animation-speeds, "fast") linear,
            border-color map-get($animation-speeds, "fast") linear;

        > svg {
            margin-left: -5px;
        }

        &:hover,
        &:focus {
            background: palette("grey", "sunken");
            outline: 0;
            border-color: palette("grey", "asher");
        }
    }
</style>
