<script>
/***********************************************************************************************************************
 * ShipyardConstructing
 * this component shows the status of the current shipyard build (upgrade or construction)
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
export default {
    props: {
        id: { type: String, required: true }
    },
    components: {
        Icon
    },
    computed: {
        shipyard () { return this.$store.getters.shipyardById(this.id); }
    }
};
</script>

<template>
    <ul>
        <li>{{ $t("common.shipyards.status.label") }}:</li>
        <li
            v-if="shipyard.active"
            class="ready">
            <icon name="done" />
            {{ $t("common.shipyards.status.ready") }}
        </li>
        <li
            v-if="!shipyard.active && shipyard.turnsUntilComplete !== 0"
            class="constructing">
            <icon name="build" />
            {{ $t("common.shipyards.status.constructing") }}
        </li>
        <li
            v-if="!shipyard.active && shipyard.turnsUntilComplete !== 0"
            class="constructing">
            <icon name="res-turns" />
            {{ shipyard.turnsUntilComplete }}
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    ul {
        display: flex;
        flex-wrap: wrap;

        padding: 1rem 1rem 0.5rem 1rem;
        border-bottom: 1px solid palette("brand", "viking");
        margin: 0;

        list-style: none;

        > li {
            display: flex;
            align-items: center;

            padding: 0.5rem 1rem;
            border: 1px solid palette("grey", "raven");
            margin: 0 0.5rem 0.5rem 0;

            background-color: palette("grey", "deep");

            &:last-child { margin: 0 0 0.5rem 0; }

            > svg { margin-right: 0.5rem; }

            &.ready {
                background-color: palette("state", "online");
                color: palette("text", "light");
                border-color: palette("state", "success");
            }

            &.constructing {
                background-color: palette("grey", "deep");
                color: palette("text", "light");
                border-color: palette("state", "building");
            }
        }
    }
</style>
