<script>
/***********************************************************************************************************************
 * shows a progress bar
 **********************************************************************************************************************/
export default {
    props: {
        max: {
            type: Number,
            required: true
        },
        value: {
            type: Number,
            default: 0
        },
        active: {
            type: Boolean,
            default: true
        },
        showText: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        remainingStyle () {
            return { width: Math.floor(100 - this.donePct) + "%" };
        },
        donePct () { return this.value / this.max * 100; },
        boxClass () { return this.active ? "box active" : "box"; },
        textClass () { return this.showText ? "text" : "text hidden"; }
    }
};
</script>

<template>
    <div
        role="progressbar"
        aria-valuemin="0"
        :aria-valuemax="max"
        :aria-valuenow="value"
        :class="boxClass">
        <div
            class="remaining"
            :style="remainingStyle" />
        <div :class="textClass">
            {{ value }} / {{ max }} ({{ Math.floor(donePct) }}%)
        </div>
    </div>
</template>


<style lang="scss" scoped>
    .box {
        display: flex;
        position: relative;
        justify-content: flex-end;

        height: 16px;

        background: palette("grey", "charcoal");
        border-radius: 8px;

        &.active {
            background: linear-gradient(to right, #ff2d55, #5856d6, #34aadc, #007aff, #5ac8fa, #4cd964, #337a15);
        }
    }

    .text {
        position: absolute;
        top: 0;
        left: 50%;
        z-index: 1;

        overflow: hidden;
        transform: translateX(-50%);

        color: palette("brand", "gorse");

        line-height: 1;
        text-align: center;
        text-indent: -1000em;
        white-space: nowrap;
        text-overflow: ellipsis;

        @include respond-to("small") { text-indent: 0; }

        &.hidden {
            display: none;
        }
    }

    .remaining {
        height: 16px;

        background:
            radial-gradient(
                ellipse 8px 8px at 0 8px,
                transparent 0%,
                transparent 99.99%,
                palette("grey", "abbey") 100%
            );
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
    }
</style>
