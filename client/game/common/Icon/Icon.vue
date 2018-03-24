<script>
/*******************************************************************************************************************
 * Icon Component
 * these svg icons use a external svg sprite sheet and reference the id in that file
 ******************************************************************************************************************/
const basePath = "/public/assets/images/icons-game.svg";
export default {
    props: {
        name: {
            type: String,
            required: true
        },
        size: {
            type: Number, // [0..4]
            default: 2
        }
    },
    computed: {
        iconPath () { return `${basePath}#g-${this.name}`; },
        sizeClass () {
            switch(this.size) {
                case 0: return "tiny";
                case 1: return "small";
                case 2: return "";
                case 3: return "large";
                case 4: return "xlarge";
            }
        }
    }
};
</script>

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        :class="sizeClass">
        <use :xlink:href="iconPath" />
    </svg>
</template>

<style lang="scss" scoped>
    svg {
        display: inline-block;

        width: 2.4rem;
        height: 2.4rem;

        fill: currentColor;

        &.tiny {
            width: 1.6rem;
            height: 1.6rem;
        }

        &.small {
            width: 2rem;
            height: 2rem;
        }

        &.large {
            width: 3.2rem;
            height: 3.2rem;
        }

        &.xlarge {
            width: 6.4rem;
            height: 6.4rem;
        }
    }
</style>

