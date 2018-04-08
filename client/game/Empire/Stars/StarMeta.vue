<script>
/*******************************************************************************************************************
 * Star
 * this component displays a single star
 ******************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
export default {
    props: {
        id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    components: {
        Icon
    },
    computed: {
        starPlanets () { return this.$store.getters.starById(this.id).planets; },
        isStarNameEditing () { return this.$store.getters.editingStarNameIds.includes(this.id); },
        showPlanets () {
            if (this.$store.getters.stars.length < 2) return true;
            return this.$store.getters.userSettings.empire.toggledStars.includes(this.id);
        },
        shipyards () {
            let shipyards = 0;
            this.$store.getters.shipyards.forEach(shipyard => {
                if (this.starPlanets.includes(shipyard.planet)) shipyards++;
            });
            return shipyards;
        },
        population () {
            const populations = this.$store.getters.planets
                .filter(planet => this.starPlanets.includes(planet.id) && planet.effectivePopulation > 0)
                .map(planet => planet.effectivePopulation);
            return populations.length ? populations.reduce((acc, val) => acc + val) : 0;
        },
        shipyardLabel () { return this.$t("planet.meta.shipyards", {name: this.name}); },
        populationLabel () { return this.$t("planet.meta.population"); },
    },
};
</script>

<template>
    <span
        v-show="!isStarNameEditing && !showPlanets"
        class="meta">
        <span
            v-if="shipyards"
            class="meta__single"
            :title="shipyardLabel"
            :aria-label="shipyardLabel">
            <icon
                name="shipyards"
                class="shipyards" />
            <span class="meta__single--num meta__single--shipyard">
                {{ shipyards }}
            </span>
        </span>
        <span
            v-if="population"
            class="meta__single"
            :title="populationLabel"
            :aria-label="populationLabel">
            <icon name="population" />
            <span class="meta__single--num">
                {{ population }}
            </span>
        </span>
    </span>
</template>

<style lang="scss" scoped>
    .meta {
        display: flex;
        align-items: center;

        margin: 0 0 0 1rem;

        @include respond-to("medium") { margin: 0 0.5rem 0 1.5rem; }

        &__single {
            display: flex;
            align-items: center;

            font-size: 1.6rem;

            @include respond-to("medium") {
                margin-right: 1rem;

                &:last-child {
                    margin-right: 0;
                }
            }

            &--num {
                display: none;

                @include respond-to("medium") { display: block; }
            }

            &--shipyard { margin-left: 0.5rem; }

            > svg.shipyards { color: palette("item", "shipyard"); }
        }
    }
</style>
