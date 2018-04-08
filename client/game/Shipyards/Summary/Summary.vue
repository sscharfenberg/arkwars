<script>
/***********************************************************************************************************************
 * Shipyards Summary Component
 **********************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import {shipClassRules} from "Config";
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
        hullTypes () { return shipClassRules.hullTypes.map(ht => ht.name); },
        shipClasses () {
            const shipClasses = this.$store.getters.shipClasses.map(sc => sc.hullType); // we only care about hullType
            // prepare dynamic hullTypes object to count
            let hullTypes = {};
            this.hullTypes.forEach(ht => { hullTypes[ht] = 0; });
            // if hullType exists, increase count
            shipClasses.forEach(sc => { hullTypes.hasOwnProperty(sc) && hullTypes[sc]++; });
            return hullTypes;
        },
        titleActive () { return this.$t("summary.num.titleActive") + ": " + this.numShipyards[0]; },
        titleBuilding () { return this.$t("summary.num.titleBuilding") + ": " + this.numShipyards[1]; }
    },
    methods: {
        classLabel(hullType) {
            return `${this.$t("common.ships.hullTypes." + hullType)}: ${
                this.shipClasses[hullType]
            } ${this.$t("summary.designs.classLabel")}`;
        }
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
        <li class="item classes">
            {{ $t("summary.designs.label") }}:
            <span
                class="hull-type"
                v-for="hullType in hullTypes"
                v-if="shipClasses[hullType] !== 0"
                :title="classLabel(hullType)"
                :aria-label="classLabel(hullType)"
                :key="hullType">
                <icon :name="`hull-${hullType}`" /> {{ shipClasses[hullType] }}
            </span>
        </li>
        <li class="item production">
            {{ $t("summary.prod.label") }} (faked):
            <span class="hull-type"><icon name="hull-small" /></span>
            <span class="hull-type"><icon name="hull-small" /></span>
            <span class="hull-type"><icon name="hull-medium" /></span>
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
        flex-wrap: wrap;

        margin-bottom: 0.5rem;

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

        &.classes .hull-type > svg {
            margin-right: 0.5rem;
        }
    }

    .hull-type {
        display: flex;
        align-items: center;

        padding: 0 0.5rem;
        margin-left: 1rem;

        background-color: palette("grey", "deep");
    }
</style>
