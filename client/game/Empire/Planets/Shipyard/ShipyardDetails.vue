<script>
/***********************************************************************************************************************
 * ShipyardDetails
 * this component shows the details/hullTypes for the existing shipyard
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
        shipyard () { return this.$store.getters.shipyardById(this.id); },
        hullTypeClass () { return this.shipyard.active ? "active" : "disabled"; }
    },
    methods: {

    }
};
</script>

<template>
    <div class="details">
        <div class="label">{{ $t("common.shipyards.shipTypes") }}:</div>
        <ul class="hulls">
            <li
                v-for="hullType in shipyard.hullTypes"
                :key="hullType"
                class="hull"
                :class="hullTypeClass">
                {{ $t("common.ships.hullTypes." + hullType) }}
                <icon :name="`hull-${hullType}`" />
            </li>
            <li
                class="hull"
                :class="hullTypeClass">
                {{ $t("common.ships.hullTypes.ark") }}
                <icon name="hull-ark" />
            </li>

        </ul>
    </div>
</template>

<style lang="scss" scoped>
    .details {
        padding: 1rem 1rem 0.5rem 1rem;

        .label {
            padding: 0.5rem 1rem;
            border: 1px solid palette("grey", "raven");
            margin: 0 0 0.5rem 0;

            background-color: palette("grey", "deep");
        }

        .hulls {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;

            padding: 0;
            margin: 0;

            list-style: none;
        }

        .hull {
            display: flex;
            align-items: center;
            justify-content: center;

            width: calc(50% - 27px);
            padding: 0.5rem 1rem;
            border: 2px solid palette("grey", "raven");
            margin: 0 0 0.5rem 0;

            background-color: palette("grey", "deep");

            &:last-child { margin: 0 0 0.5rem 0; }

            > svg {
                width: 24px;
                height: 12px;
                margin-left: 1rem;
            }

            &.disabled {
                border: 2px dashed palette("state", "building");

                background: linear-gradient(to top left, palette("grey", "deep"), palette("grey", "raven"));

                cursor: not-allowed;
            }

            &.active {
                background-color: palette("state", "online");
                border-color: palette("state", "success");
            }
        }
    }
</style>
