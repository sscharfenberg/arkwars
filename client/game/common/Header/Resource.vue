<script>
/*******************************************************************************************************************
 * Resource Component
 * this componenet displays a single resource
 ******************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
import StorageLevels from "./StorageLevels/StorageLevels.vue";
import {playerRules} from "Config";
export default {
    props: {
        type: {
            type: String,
            required: true
        },
        current: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        storageLevel: {
            type: Number,
            required: true
        }
    },
    components: {
        Icon,
        StorageLevels
    },
    computed: {
        maxLevel () {
            return playerRules.resourceTypes.find(res => res.type === this.type).storageLevels.length - 1;
        },
        getResourceBarWidth () { return `${100 - (this.current / this.max) * 100}%`; },
        getResourceTypeIcon () { return "res-" + this.type; },
        getProgressBarPct () { return Math.round(this.current / this.max * 100); },
        buttonDisabled () {
            return this.storageLevel >= this.maxLevel || this.$store.getters.upgradingStorageLevels.includes(this.type);
        },
        getFullTypeLabel () {
            return this.buttonDisabled
                ? ""
                : `${this.$t("common.resourceTypes.label")}: ${this.$t("common.resourceTypes." + this.type)}`;
        },
        buttonAriaLabel () {
            return this.buttonDisabled ? "" : this.$t("common.header.storageUpgrades.buttonAriaLabel");
        },
        buttonClass () {
            let classList = this.storageLevel >= this.maxLevel ? "disabled" : "";
            classList += this.$store.getters.upgradingStorageLevels.includes(this.type) ? " upgrading" : "";
            return classList;
        }
    },
    methods: {
        showInfo () {
            if (this.storageLevel < this.maxLevel) {
                this.$modal.show(`storage-levels-${this.type}`);
            }
        }
    }
};
</script>

<template>
    <button
        class="resource-type"
        :class="buttonClass"
        :aria-label="buttonAriaLabel"
        :disabled="buttonDisabled"
        :aria-disabled="buttonDisabled"
        @click="showInfo">
        <span
            class="res"
            :title="getFullTypeLabel"
            :aria-label="getFullTypeLabel">
            <span
                class="res__bar"
                :style="{right: getResourceBarWidth}"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                :aria-valuenow="getProgressBarPct">{{ getProgressBarPct + "%" }}</span>
            <span class="res__type">
                <icon
                    :name="getResourceTypeIcon"
                    class="res__icon"
                    aria-hidden="true" />
            </span>
            <span class="res__amount">{{ current }} / {{ max }} ({{ getProgressBarPct }}%)</span>
        </span>
        <storage-levels
            :level="storageLevel"
            :area="type" />
    </button>
</template>

<style lang="scss" scoped>
    .resource-type {
        display: flex;

        padding: 0;
        border: 0;
        margin: 0 0.4rem 0.4rem 0;

        background: transparent;
        color: palette("text", "light");
        cursor: pointer;

        font-size: 1.5rem;
        font-weight: 300;
        line-height: 1.4;

        &:not(.disabled):hover .res {
            background-color: palette("grey", "bunker");

            &__bar {
                background: palette("state", "online");
            }
        }

        &[disabled],
        &.disabled {
            cursor: default;
        }

        &.upgrading {
            opacity: 0.8;

            cursor: not-allowed;
        }
    }

    .res {
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;

        width: 17rem;
        padding: 0.5rem;
        border: 1px solid palette("grey", "sunken");

        background-color: rgba(palette("grey", "raven"), 0.8);

        &__bar {
            display: block;
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;

            background: linear-gradient(to bottom, palette("state", "success") 0%, palette("state", "online") 100%);

            text-indent: -1000em;
        }

        &__icon {
            display: block;

            margin-right: 0.5rem;
        }

        &__type {
            display: block;

            padding-right: 0.5rem;
        }

        &__type,
        &__amount {
            display: flex;
            z-index: z("form");
            align-items: center;
        }
    }
</style>
