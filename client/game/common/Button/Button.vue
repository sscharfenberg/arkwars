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
            disabled: {
                type: Boolean,
                default: false
            },
            label: {
                type: String
            }
        },
        computed: {
            isDisabled() {
                return this.disabled;
            },
            typeModifier() {
                return this.iconName && !this.textString ? "btn--icon" : "btn--text";
            },
            getLabel() {
                return this.label || this.textString || "";
            }
        },
        components: {
            "icon": Icon
        }
    };
</script>

<template>
    <button class="btn"
            @click="onClick"
            :disabled="isDisabled"
            :aria-disabled="isDisabled"
            v-bind:class="typeModifier"
            :aria-label="getLabel"
            :title="getLabel">
        <icon v-if="iconName" :name="iconName" />
        <span v-if="textString">{{ textString }}</span>
    </button>
</template>

<style lang="scss" scoped>
    $btnBaseHeight: 3.4rem;

    .btn {
        display: flex;
        align-items: center;

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
        }

        &[disabled] {
            opacity: 0.3;

            cursor: not-allowed;
        }
    }
</style>

