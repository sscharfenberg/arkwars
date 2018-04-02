<script>
/***********************************************************************************************************************
 * ShipyardUpgrade
 * this component allows upgrading of an existing shipyard
 **********************************************************************************************************************/
import {shipyardRules} from "Config";
import Costs from "Game/common/Costs/Costs.vue";
import Button from "Game/common/Button/Button.vue";
export default {
    props: {
        id: {
            type: String,
            required: true
        }
    },
    components: {
        Costs,
        btn: Button
    },
    computed: {
        shipyard () { return this.$store.getters.shipyardById(this.id); },
        upgrade () {
            let upgrade = "";
            shipyardRules.hullTypes.map(hullType => hullType.name).reverse().forEach(hullType => {
                if (!this.shipyard.hullTypes.includes(hullType)) upgrade = hullType;
            });
            return upgrade;
        },
        costs () {
            if (this.upgrade === "") return [];
            return shipyardRules.hullTypes.find(hullType => hullType.name === this.upgrade).costs.upgrade;
        },
        stockpile () { return this.$store.getters.playerResources; },
        sufficientFunds () {
            let canInstall = true;
            const costs = this.costs.filter(cost => cost.resourceType !== "turns");
            costs.forEach( cost => {
                const stockpile = this.stockpile.find(stock => stock.type === cost.resourceType).current;
                if ( cost.amount > stockpile ) canInstall = false;
            });
            return canInstall;
        },
        confirmDisabled () { return this.upgrade === "" || !this.sufficientFunds; }
    },
    methods: {
        upgradeConfirmed () {
            this.$modal.hide(`shipyard-modal-${this.shipyard.planet}`);
            return this.$store.dispatch("UPGRADE_SHIPYARD", {id: this.id, planet: this.shipyard.planet});
        }
    }
};
</script>

<template>
    <div
        class="upgrade"
        v-if="upgrade && shipyard.active">
        <header>
            {{ $t("planet.shipyard.upgrade.title", {type: $t("common.shipyards.types." + this.upgrade) }) }}
        </header>
        <p>
            {{ $t("planet.shipyard.upgrade.explanation") }}
        </p>
        <costs
            class="upgrade-costs"
            :costs="costs" />
        <div class="action">
            <btn
                :on-click="upgradeConfirmed"
                :text-string="$t('common.buttons.installUpgrade')"
                icon-name="done"
                :disabled="confirmDisabled" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .upgrade {
        border-top: 1px solid palette("brand", "viking");

        > header {
            padding: 1rem;

            color: palette("brand", "viking");
        }

        > p {
            padding: 0 1rem 1rem 1rem;
            margin: 0;
        }

        .upgrade-costs {
            padding: 0 1rem 1rem 1rem;
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
    }
</style>
