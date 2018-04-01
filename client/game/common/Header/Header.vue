<script>
/***********************************************************************************************************************
 * Common Header Component
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import FetchGameDataButton from "./FetchGameDataButton.vue";
import Resource from "./Resource.vue";
import StorageLevelsModal from "./StorageLevels/StorageLevelsModal.vue";
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
        Resource,
        StorageLevelsModal,
        Icon
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
        class="header"
        v-if="player.name && resources.length">
        <fetch-button
            class="fetch-data-button"
            :area="area" />
        <h1>
            <span class="area">
                <icon
                    :name="area"
                    :size="3" />
                {{ areaTitle }}
            </span>
            <small>
                [{{ player.ticker }}] {{ player.name }}
            </small>
        </h1>
        <div
            class="resources"
            v-if="resources.length">
            <resource
                v-for="resource in resources"
                :key="resource.type"
                :type="resource.type"
                :current="resource.current"
                :max="resource.max"
                :storage-level="resource.storageLevel" />
            <storage-levels-modal
                v-for="resource in resources"
                :key="`modal-${resource.type}`"
                :resource-type="resource.type" />
        </div>
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
        &.starchart { background-image: url("bg/starchart.jpg"); }
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

        .area {
            display: flex;
            align-items: center;

            > svg {
                width: 3.6rem;
                height: 3.6rem;
                margin-right: 1rem;

                color: palette("brand", "christine");

                @include respond-to("medium") { margin-right: 2rem; }
            }
        }
    }

    .resources {
        display: flex;
        flex-wrap: wrap;

        margin: 0 1.6rem 1.6rem 1.6rem;
    }
</style>

