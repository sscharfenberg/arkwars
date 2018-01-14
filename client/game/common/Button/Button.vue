<script>
    /*******************************************************************************************************************
     * Button Component
     ******************************************************************************************************************/
    import Icon from "Game/common/Icon/Icon.vue";
    export default {
        props: {
            onClick: {
                type: Function,
                required: true
            },
            textString: {
                type: String
            },
            iconName: {
                type: String
            },
            disable: {
                type: Boolean,
                default: false
            },
            label: {
                type: String
            },
            scale: {
                type: Number, // [0..2]
                default: 2
            }
        },
        computed: {
            isDisabled() { return this.disable; },
            typeModifier() { return this.iconName && !this.textString ? "btn--icon" : "btn--text"; },
            getLabel() { return this.label || this.textString || ""; },
            getSizeClass() {
                switch(this.scale) {
                    case 0: return "tiny";
                    case 1: return "small";
                    case 2: return "";
                    case 3: return "large";
                }
            }
        },
        components: {
            "icon": Icon
        }
    };
</script>

<template>
    <button class="btn"
            v-bind:class="[typeModifier, getSizeClass]"
            @click="onClick"
            :disabled="isDisabled"
            :aria-disabled="isDisabled"
            :aria-label="getLabel"
            :title="getLabel">
        <icon v-if="iconName"
            :name="iconName"
            :size="scale" />
        <span v-if="textString">{{ textString }}</span>
    </button>
</template>

<style lang="scss" scoped>
    $btnBaseHeight: 3.4rem;

    .btn {
        display: flex;
        align-items: center;
        justify-content: center;

        height: $btnBaseHeight;
        border: 1px solid palette("grey", "asher");

        background: palette("grey", "raven");
        color: palette("text", "tint");
        cursor: pointer;

        transition:
            background-color map-get($animation-speeds, "fast") linear,
            color map-get($animation-speeds, "fast") linear,
            border-color map-get($animation-speeds, "fast") linear;

        &:hover:not([disabled]),
        &:focus {
            background: palette("grey", "bunker");
            color: palette("brand", "viking");
            outline: 0;
            border-color: palette("grey", "raven");
        }

        &:active {
            background: palette("grey", "ebony");
            color: palette("grey", "white");
        }

        &--icon {
            width: $btnBaseHeight;

            border-radius: 50%;

            &.tiny { width: 2.6rem; }
            &.small { width: 3rem; }
            &.large { width: 4.2rem; }
        }

        &[disabled] {
            opacity: 0.3;

            cursor: not-allowed;
        }

        &.tiny { height: 2.6rem; }
        &.small { height: 3rem; }

        &.large {
            height: 4.2rem;

            font-size: 2rem;
        }

        &--text {
            > svg {
                margin-right: 0.5rem;
            }
        }
    }
</style>

