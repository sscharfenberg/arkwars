<script>
/*******************************************************************************************************************
 * Common Header Component
 ******************************************************************************************************************/
import FetchGameDataButton from "./FetchGameDataButton.vue";
import Resource from "./Resource.vue";
export default {
    props: {
        areaTitle: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        }
    },
    components: {
        "fetch-button": FetchGameDataButton,
        Resource
    },
    computed: {
        player () { return this.$store.getters.player; },
        resources () { return this.$store.getters.playerResources; }
    }
};
</script>

<template>
    <header
        :class="area"
        class="header">
        <fetch-button
            class="fetch-data-button"
            :area="area" />
        <h1>
            {{ areaTitle }}
            <small v-if="player.name">
                <br>[{{ player.ticker }}]
                {{ player.name }}
            </small>
        </h1>
        <ul
            class="resources"
            v-if="resources.length">
            <li
                v-for="resource in resources"
                :key="resource.type">
                <resource
                    :type="resource.type"
                    :current="resource.current"
                    :max="resource.max" />
            </li>
        </ul>
    </header>
</template>

<style lang="scss" scoped>
    .header {
        display: flex;
        position: relative;
        align-items: flex-start;
        flex-direction: column;
        flex-wrap: nowrap;

        background: palette("grey", "bunker") none 50% 50% no-repeat;
        background-size: cover;

        &.empire { background-image: url("bg/empire.jpg"); }
        &.fleets { background-image: url("bg/fleets.jpg"); }
        &.shipyards { background-image: url("bg/shipyards.jpg"); }
        &.research { background-image: url("bg/research.jpg"); }
        &.starmap { background-image: url("bg/starmap.jpg"); }
        &.galnet { background-image: url("bg/galnet.jpg"); }
    }

    h1 {
        padding: 1.6rem;
        margin: 0;

        color: palette("grey", "mystic");

        font-size: 4rem;

        font-weight: 400;
        line-height: 1;
        text-shadow:
            2px 2px 0 palette("grey", "bunker"),
            -2px 2px 0 palette("grey", "bunker"),
            -2px -2px 0 palette("grey", "bunker"),
            2px -2px 0 palette("grey", "bunker");
        text-transform: uppercase;
        letter-spacing: 0.2rem;

        > small {
            color: lighten(palette("text", "tint"), 20%);

            font-size: 0.7em;
            text-shadow:
                1px 1px 0 palette("grey", "bunker"),
                -1px 1px 0 palette("grey", "bunker"),
                -1px -1px 0 palette("grey", "bunker"),
                1px -1px 0 palette("grey", "bunker");
            text-transform: none;
        }
    }

    .resources {
        display: flex;
        flex-wrap: wrap;

        padding: 0;
        margin: 0 1.6rem 1.6rem 1.6rem;

        list-style: none;
    }
</style>

