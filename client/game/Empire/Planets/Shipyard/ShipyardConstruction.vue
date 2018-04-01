<script>
/***********************************************************************************************************************
 * ShipyardConstruction
 * this component allows construction of a shipyard
 **********************************************************************************************************************/
import {shipyardRules} from "Config";
import Icon from "Game/common/Icon/Icon.vue";
import Costs from "Game/common/Costs/Costs.vue";
import Button from "Game/common/Button/Button.vue";
export default {
    data: function() {
        return {
            selectedType: ""
        };
    },
    props: {
        planetId: {
            type: String,
            required: true
        }
    },
    components: {
        btn: Button,
        Icon,
        Costs
    },
    computed: {
        shipyardTypes () { return shipyardRules.hullTypes.map(hullType => hullType.name); },
        costs () {
            if (!this.selectedType) return [];
            return shipyardRules.hullTypes.find(hullType => hullType.name === this.selectedType).costs.build;
        },
        confirmDisabled () { return this.selectedType === "" || !this.sufficientFunds; },
        stockpile () { return this.$store.getters.playerResources; },
        sufficientFunds () {
            let canInstall = true;
            const costs = this.costs.filter(cost => cost.resourceType !== "turns");
            costs.forEach( cost => {
                const stockpile = this.stockpile.find(stock => stock.type === cost.resourceType).current;
                if ( cost.amount > stockpile ) canInstall = false;
            });
            return canInstall;
        }
    },
    methods: {
        selectType (type) { this.selectedType = this.selectedType !== type ? type : ""; },
        typeClass (type) { return this.selectedType === type ? "selected" : ""; },
        typeLabel (type) { return this.$t("common.shipyards.types." + type); },
        constructionConfirmed () {
            alert("construct " + this.selectedType + " on " + this.planetId);
        }
    }
};
</script>

<template>
    <div class="construction">
        <header>{{ $t('planet.shipyard.button.construct') }}</header>
        <div class="types">
            <button
                class="type"
                v-for="type in shipyardTypes"
                :key="type"
                :class="typeClass(type)"
                @click="selectType(type)"
                :aria-selected="selectedType === type"
                :title="typeLabel(type)"
                :aria-label="typeLabel(type)">
                <icon :name="`hull-${type}`" />
            </button>
        </div>
        <costs
            class="construction-costs"
            :costs="costs" />
        <div class="action">
            <btn
                :on-click="constructionConfirmed"
                :text-string="$t('common.buttons.construct')"
                icon-name="done"
                :disabled="confirmDisabled" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .construction {
        > header {
            padding: 1rem;
        }

        .construction-costs {
            margin: 0 1rem 1rem 1rem;
        }
    }

    .types {
        display: flex;

        padding: 0 1rem 1rem 1rem;
        margin: 0;

        list-style: none;
    }

    .type {
        display: flex;
        align-items: center;
        justify-content: center;

        padding: 1rem;
        border: 2px solid palette("grey", "raven");
        margin-right: 1rem;
        flex: 1;

        background: palette("grey", "deep");
        color: palette("text");

        transition:
            background-color map-get($animation-speeds, "fast") linear,
            border-color map-get($animation-speeds, "fast") linear;

        &:last-child { margin-right: 0; }

        &:hover,
        &:active {
            background-color: palette("grey", "sunken");
            border-color: palette("grey", "abbey");

            cursor: pointer;
        }

        &.selected {
            background-color: palette("grey", "ebony");
            border-color: palette("state", "success");
        }

        > svg {
            width: 24px;
            height: 12px;
        }
    }

    .action {
        display: flex;
        justify-content: stretch;

        padding: 0.2rem;
        border-top: 1px solid palette("brand", "viking");

        > button {
            justify-content: center;

            margin-right: 0.2rem;
            flex: 1;

            &:last-child {
                margin-right: 0;
            }
        }
    }
</style>
