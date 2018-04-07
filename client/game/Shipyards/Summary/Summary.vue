<script>
/***********************************************************************************************************************
 * Shipyards Summary Component
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
export default {
    components: {
        Icon
    },
    computed: {
        numShipyards () {
            const shipyards = this.$store.getters.shipyards;
            return [
                shipyards.filter(shipyard => shipyard.active).length,
                shipyards.filter(shipyard => !shipyard.active).length
            ];
        },
        titleActive () { return this.$t("summary.num.titleActive") + ": " + this.numShipyards[0]; },
        titleBuilding () { return this.$t("summary.num.titleBuilding") + ": " + this.numShipyards[1]; }
    }
};
</script>

<template>
    <ul class="summary">
        <li class="item shipyards">
            {{ $t("summary.num.label") }}:
            <span
                class="active"
                :aria-label="titleActive"
                :title="titleActive">
                <icon name="shipyards" />
                {{ numShipyards[0] }}
            </span>
            <span
                class="building"
                :aria-label="titleBuilding"
                :title="titleBuilding">
                <icon name="shipyards" />
                {{ numShipyards[1] }}
            </span>
        </li>
        <li class="item production">
            Currently in Production (faked):
            <icon name="hull-small" />
            <icon name="hull-small" />
            <icon name="hull-medium" />
        </li>
        <li>
            Currently available designed shipclasses (faked): 6
        </li>
    </ul>
</template>

<style lang="scss" scoped>
    .summary {
        padding: 0;
        margin: 0 0 1rem 0;

        list-style: none;

        @include respond-to("medium") {
            margin-bottom: 0;
            flex: 1 1 calc(50% - 1rem);
        }
    }

    .item {
        display: flex;
        align-items: center;

        margin-bottom: 0.2rem;

        &:last-child {
            margin-bottom: 0;
        }

        &.shipyards {
            .active,
            .building {
                display: flex;
                align-items: center;
            }

            svg { margin: 0 1rem; }
            .active > svg { color: palette("item", "shipyard"); }
            .building > svg { color: palette("text", "subdued"); }
        }

        &.production > svg {
            margin: 0 0 0 0.5rem;
        }
    }
</style>
