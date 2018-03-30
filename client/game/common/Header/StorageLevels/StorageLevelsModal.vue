<script>
/***********************************************************************************************************************
 * StorageLevels Modal
 * Info Window that shows storage levels for a specific resourceType and allows upgrade installation
 **********************************************************************************************************************/
import Button from "Game/common/Button/Button.vue";
import Costs from "Game/common/Costs/Costs.vue";
import {playerRules} from "Config";
export default {
    props: {
        resourceType: {
            type: String,
            required: true
        }
    },
    components: {
        btn: Button,
        Costs
    },
    computed: {
        playerResources () { return this.$store.getters.playerResources; },
        resourceStats () { return this.$store.getters.playerResources.find(res => res.type === this.resourceType); },
        nextLevel () {
            const resourceRules = playerRules.resourceTypes.find(res => res.type === this.resourceType);
            const maxLevel = resourceRules.storageLevels.length - 1;
            const nextLevel = this.resourceStats.storageLevel + 1;
            if ( nextLevel > maxLevel ) return -1;
            return nextLevel;
        },
        costs () {
            return playerRules.resourceTypes
                .find(res => res.type === this.resourceType).storageLevels[this.nextLevel].costs;
        },
        newStorage () {
            return playerRules.resourceTypes.find(res => res.type === this.resourceType).storageLevels
                .find(lvl => lvl.lvl === this.nextLevel).amount;
        },
        sufficientFunds () {
            let sufficientFunds = true;
            const costs = this.costs.filter(cost => cost.resourceType !== "turns");
            costs.forEach( cost => {
                const stockpile = this.playerResources.find(stock => stock.type === cost.resourceType).current;
                if ( cost.amount > stockpile ) sufficientFunds = false;
            });
            return sufficientFunds;
        }
    },
    methods: {
        closeMe () { this.$modal.hide(`storage-levels-${this.resourceType}`); },
        confirmUpgrade () {
            alert("upgrade confirmed, ask server!");
            this.$modal.hide(`storage-levels-${this.resourceType}`);
        }
    }
};
</script>

<template>
    <modal
        :name="`storage-levels-${resourceType}`"
        :adaptive="true"
        :width="320"
        :scrollable="true"
        height="auto">
        <header class="modal__header">
            {{ $t("common.header.storageUpgrades.title." + resourceType) }}
        </header>
        <div class="modal__text">
            {{ $t("common.header.storageUpgrades.currentStorage") }}: {{ resourceStats.max }}
        </div>
        <div
            v-if="nextLevel !== -1"
            class="modal__costs">
            <costs :costs="costs" />
        </div>
        <div
            v-if="nextLevel !== -1"
            class="modal__text">
            {{ $t("common.header.storageUpgrades.newStorage") }}: {{ newStorage }}
        </div>
        <div
            v-if="nextLevel !== -1"
            class="modal__actions">
            <btn
                :on-click="confirmUpgrade"
                :text-string="$t('common.header.storageUpgrades.confirm')"
                icon-name="done"
                :disable="!sufficientFunds" />
        </div>
        <btn
            class="close-modal"
            :on-click="closeMe"
            icon-name="cancel" />
    </modal>
</template>



<style lang="scss" scoped>
    .modal {
        &__header {
            padding: 1rem;
            border-bottom: 1px solid palette("brand", "viking");

            color: palette("brand", "viking");

            font-size: 1.8rem;
        }

        &__costs {
            padding: 1rem;
            border-bottom: 1px solid palette("brand", "viking");
        }

        &__text {
            padding: 1rem;
            border-bottom: 1px solid palette("brand", "viking");
        }

        &__actions {
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
