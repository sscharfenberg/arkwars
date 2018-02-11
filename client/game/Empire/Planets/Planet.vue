<script>
/*******************************************************************************************************************
 * Planet
 * this component displays a single planet
 ******************************************************************************************************************/
import {latinToRoman} from "../../handlers/format";
import Icon from "Game/common/Icon/Icon.vue";
import Resources from "./Resources/Resources.vue";
import Population from "./Population/Population.vue";
import Defense from "./Defense/Defense.vue";
export default {
    props: {
        id: {
            type: String,
            required: true
        },
        starName: {
            type: String,
            required: true
        }
    },
    computed: {
        getPlanetVisualClass () { return "planet__visual--" + this.$store.getters.planetById(this.id).type; },
        getPlanetTypeToolTip () {
            return this.$t("planet.typeLabel") +
                ": " +
                this.$t("planet.types." +
                this.$store.getters.planetById(this.id).type);
        },
        getPlanetAriaLabel () { return this.$t("planet.typeLabel"); },
        getPlanetType () { return this.$t("planet.types." + this.$store.getters.planetById(this.id).type); },
        getPlanetName () {
            return `${this.starName} - ${latinToRoman(this.$store.getters.planetById(this.id).orbitalIndex)}`;
        },
        effectivePopulation () { return this.$store.getters.planetById(this.id).effectivePopulation; },
        resourceSlots () { return this.$store.getters.planetById(this.id).resourceSlots; }
    },
    components: {
        Resources,
        Icon,
        Defense,
        Population
    }
};
</script>

<template>
    <div class="planet">
        <div class="planet__orbit">
            <aside
                class="planet__visual"
                :class="getPlanetVisualClass"
                :title="getPlanetTypeToolTip"
                :aria-label="getPlanetAriaLabel">{{ getPlanetType }}</aside>
        </div>
        <div class="planet__data">
            <div
                class="planet__name"
                :label="$t('planet.name')"
                :title="$t('planet.name')">{{ getPlanetName }}</div>
            <population
                v-if="effectivePopulation > 0"
                :planet-id="id"
                :star-name="starName"/>
            <resources
                v-if="resourceSlots.length"
                :resources="resourceSlots"
                :planet-id="id"
                :planet-name="getPlanetName" />
            <defense
                :planet-id="id"
                :star-name="starName" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .planet {
        display: flex;

        &__orbit {
            overflow: hidden;

            width: 48px;
            margin-right: 0.5rem;
            flex: 0 0 48px;

            background: url("./orbits.svg") 0 0 no-repeat;
        }

        &__visual {
            width: 48px;
            height: 48px;

            background: transparent url("./planets.png") 0 0 no-repeat;

            text-indent: -1000em;

            // these need to be synced with /server/config/index.js
            &--gas { background-position: 0 -48px; }
            &--ice { background-position: 0 -96px; }
            &--iron { background-position: 0 -144px; }
            &--desert { background-position: 0 -192px; }
            &--toxic { background-position: 0 -240px; }
            &--carbon { background-position: 0 -288px; }
            &--tomb { background-position: 0 -336px; }
        }

        &__data {
            display: flex;
            align-items: flex-start;
            flex-direction: row;
            flex-wrap: wrap;

            margin-top: 0.9rem;
        }

        &__name {
            height: 2.6rem;
            padding: 0.5rem 1rem;
            border: 1px solid palette("grey", "abbey");
            margin: 0 0.8rem 0.8rem 0;

            background: rgba(palette("grey", "mystic"), 0.05);
            color: palette("text", "lighter");
        }
    }
</style>
