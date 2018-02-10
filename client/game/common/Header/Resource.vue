<script>
/*******************************************************************************************************************
 * Resource Component
 * this componenet displays a single resource
 ******************************************************************************************************************/
import Icon from "Game/common/Icon/Icon.vue";
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
        }
    },
    components: {
        Icon
    },
    computed: {
        getResourceBarWidth () { return `${100 - (this.current / this.max) * 100}%`; },
        getResourceTypeIcon () { return "res-" + this.type; },
        getProgressBarPct () { return Math.round(this.current / this.max * 100); },
        getFullTypeLabel () {
            return `${this.$t("common.resourceTypes.label")}: ${this.$t("common.resourceTypes." + this.type)}`;
        }
    }
};
</script>

<template>
    <div
        class="res"
        :title="getFullTypeLabel"
        :aria-label="getFullTypeLabel">
        <div
            class="res__bar"
            :style="{right: getResourceBarWidth}"
            role="progressbar"
            aria-valuemin="0"
            aria-valuemax="100"
            :aria-valuenow="getProgressBarPct">{{ getProgressBarPct + "%" }}</div>
        <div class="res__type">
            <icon
                :name="getResourceTypeIcon"
                class="res__icon"
                aria-hidden="true" />
        </div>
        <div class="res__amount">{{ current }} / {{ max }} ({{ getProgressBarPct }}%)</div>
    </div>
</template>

<style lang="scss" scoped>
    .res {
        display: flex;
        position: relative;
        align-items: center;
        justify-content: center;

        width: 17rem;
        padding: 0.2rem 0.5rem;
        border: 1px solid palette("grey", "sunken");
        margin: 0 0.4rem 0.4rem 0;

        background: rgba(palette("grey", "raven"), 0.6);

        &__bar {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;

            background: linear-gradient(to top, darken(palette("state", "success"), 20%) 0%, palette("state", "success") 100%);

            text-indent: -1000em;
        }

        &__icon {
            margin-right: 0.5rem;
        }

        &__type {
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
