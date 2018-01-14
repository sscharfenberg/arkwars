<script>
    /*******************************************************************************************************************
     * Costs
     * this component displays the cost for something
     ******************************************************************************************************************/
    import Icon from "Game/common/Icon/Icon.vue";
    export default {
        props: {
            costs: {
                type: Array,
                required: true
            }
        },
        components: {
            "icon": Icon
        },
        computed: {
            playerResources () { return this.$store.getters.playerResources; }
        },
        methods: {
            isStockpiled ( resourceType ) {
                if (resourceType === "turns") return true;
                const cost = this.costs.find( slot => slot.resourceType === resourceType).amount;
                const stockpile = this.playerResources.filter(resource => resource.type === resourceType).shift().current;
                return stockpile >= cost;
            },
            getAffordableClass ( resourceType ) {
                if (resourceType === "turns") return "";
                return this.isStockpiled(resourceType) ? "affordable" : "insufficient-funds";
            }
        }
    };
</script>

<template>
    <ul class="costs">
        <li class="title">{{ $t("common.costs.label") }}:</li>
        <li class="cost"
            v-for="cost in costs"
            :class="getAffordableClass(cost.resourceType)"
            :aria-label="$t('common.costs.ariaLabel', {type: $t('common.resourceTypes.'+cost.resourceType)})">
            {{ cost.amount }}
            <icon :name="'res-'+cost.resourceType" :size="1" />
        </li>
    </ul>
</template>



<style lang="scss" scoped>
    .costs {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        padding: 0;
        margin: 0;

        list-style: none;

        > li {
            padding: 0.5rem 1rem;
            margin: 0 2px 2px 0;

            &:last-child {
                margin-right: 0;
            }
        }

        .title {
            border: 1px solid palette("grey", "abbey");

            background: palette("grey", "raven");
        }

        .cost {
            display: flex;
            align-items: center;

            height: 2.2rem;
            border: 1px solid palette("grey", "abbey");

            background: palette("grey", "deep");

            > svg {
                margin-left: 0.5rem;
            }

            &.insufficient-funds {
                color: palette("state", "error");
                border-color: palette("state", "error");
            }

            &.affordable {
                border-color: palette("state", "success");
            }
        }
    }
</style>
