<script>
    /*******************************************************************************************************************
     * Planet
     * this component displays a single planet
     ******************************************************************************************************************/
    import {latinToRoman} from "../../handlers/format";
    import Resources from "./Resources/Resources.vue";
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
            getPlanetVisualClass () { return "planet__visual--" + this.$store.getters.getPlanetById(this.id).type; },
            getPlanetTypeToolTip () {
                return this.$t("planet.typeLabel") +
                    ": " +
                    this.$t("planet.types." +
                    this.$store.getters.getPlanetById(this.id).type);
            },
            getPlanetAriaLabel () { return this.$t("planet.typeLabel"); },
            getPlanetType () { return this.$t("planet.types." + this.$store.getters.getPlanetById(this.id).type); },
            getPlanetName () {
                return `${this.starName} - ${latinToRoman(this.$store.getters.getPlanetById(this.id).orbitalIndex)}`;
            }
        },
        methods: {
            resourceSlots () { return this.$store.getters.getPlanetById(this.id).resourceSlots; }
        },
        components: {
            "resources": Resources
        }
    };
</script>

<template>
    <div class="planet">

        <div class="planet__orbit">
            <aside class="planet__visual"
                   v-bind:class="getPlanetVisualClass"
                   :title="getPlanetTypeToolTip"
                   :aria-label="getPlanetAriaLabel">{{ getPlanetType }}</aside>
        </div>

        <div class="planet__data">
            <div class="planet__name"
                 :label="$t('planet.name')"
                 :title="$t('planet.name')">{{getPlanetName}}</div>
            <div class="planet__population">
                population
            </div>
            <resources v-if="resourceSlots().length"
                       :resources="resourceSlots()"
                       :planetid="this.id"
                       :planetName="getPlanetName" />
            <div class="planet__defense">
                pds
            </div>
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

        &__population,
        &__defense,
        &__name {
            height: 2.4rem;
            padding: 0.5rem 1rem;
            border: 1px solid palette("grey", "abbey");
            margin: 0 0.8rem 0.8rem 0;

            background: rgba(palette("grey", "mystic"), 0.05);
        }

        &__name {
            color: palette("text", "lighter");
        }
    }
</style>
