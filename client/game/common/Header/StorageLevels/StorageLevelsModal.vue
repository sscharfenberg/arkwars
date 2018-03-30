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
        installingUpgrades () {
            return this.$store.getters.storageUpgrades
                .find(upgrade => upgrade.area === this.resourceType);
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
            this.$store.dispatch("UPGRADE_STORAGE_LEVELS", this.resourceType);
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
        <ul
            class="modal__building"
            v-if="installingUpgrades">
            <li class="modal__building-label">
                <div class="text">
                    {{ $t("common.header.storageUpgrades.building") }}
                </div>
                <div class="dots">
                    <div
                        v-for="n in installingUpgrades.turnsUntilComplete"
                        class="modal__build-turn"
                        role="presentation"
                        aria-hidden="true"
                        :key="n">•</div>
                </div>
            </li>
            <li class="modal__building-turns">
                {{ $t("common.header.storageUpgrades.untilComplete") }}:
                {{ installingUpgrades.turnsUntilComplete }}
            </li>
        </ul>
        <div
            v-if="nextLevel !== -1 && !installingUpgrades"
            class="modal__costs">
            <costs :costs="costs" />
        </div>
        <div
            v-if="nextLevel !== -1"
            class="modal__text">
            {{ $t("common.header.storageUpgrades.newStorage") }}: {{ newStorage }}
        </div>
        <div
            v-if="nextLevel !== -1 && !installingUpgrades"
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
            border-top: 1px solid palette("brand", "viking");
            border-bottom: 1px solid palette("brand", "viking");
        }

        &__text {
            padding: 1rem;
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

        &__building {
            padding: 1rem;
            border-top: 1px solid palette("brand", "viking");
            border-bottom: 1px solid palette("brand", "viking");
            margin: 0;

            list-style: none;
        }

        &__building-label {
            display: flex;
            align-items: center;

            box-sizing: border-box;
            width: 100%;
            padding: 0.1rem 1rem;
            border: 1px solid palette("grey", "abbey");
            margin-bottom: 0.2rem;

            background: palette("grey", "raven");

            > .dots {
                display: flex;
                flex-wrap: wrap;

                padding-top: 4px;
                margin-left: 1rem;
            }
        }

        &__building-turns {
            padding: 0.5rem 1rem;

            border: 1px solid palette("grey", "abbey");

            background: palette("grey", "deep");
        }

        &__build-turn {
            width: 4px;
            height: 4px;
            margin: 0 4px 4px 0;

            background: linear-gradient(to bottom, palette("state", "warning") 0%, palette("state", "error") 100%);

            border-radius: 50%;

            text-indent: -1000em;
        }
    }
</style>
