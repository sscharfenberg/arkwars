<script>
    /*******************************************************************************************************************
     * Planet
     * this component displays a single planet
     ******************************************************************************************************************/
    import {latinToRoman} from "../../handlers/format";
    import Resources from "./Resources/Resources.vue";
    export default {
        data: function() {
            return {
                planet: this.$store.getters.getPlanetById(this.id)
            };
        },
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
            getPlanetVisualClass: function() {
                return "planet__visual--" + this.planet.type;
            },
            getPlanetTypeToolTip: function() {
                return `${this.$t("planet.typeLabel")}: ${this.$t("planet.types." + this.planet.type)}`;
            },
            getPlanetAriaLabel: function() {
                return this.$t("planet.typeLabel");
            },
            getPlanetType: function() {
                return this.$t("planet.types." + this.planet.type);
            },
            getPlanetName: function() {
                return `${this.starName} - ${latinToRoman(this.planet.orbitalIndex)}`;
            },
            //getResources () {
            //    if (!this.planet.resources) return [];
            //    if (!this.planet.harvesters.length) return this.planet.resources;
            //    this.planet.harvesters.forEach( harvester => {
            //        let res = this.planet.resources.find( resource => resource.resourceType === harvester.resourceType);
            //        console.log(harvester.resourceType, res);
            //    });
            //}
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
            <resources v-if="planet.resourceSlots.length"
                       :resources="planet.resourceSlots" />
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
