<script>
    /*******************************************************************************************************************
     * Icon Component
     * these svg icons use a external svg sprite sheet and reference the id in that file
     ******************************************************************************************************************/
    export default {
        props: {
            name: {
                type: String,
                required: true
            },
            size: {
                type: Number, // [0..3]
                default: 2
            }
        },
        computed: {
            iconPath() {
                return `/public/assets/images/icons-game.svg#${this.name}`;
            },
            sizeClass() {
                switch(this.size) {
                    case 0: return "tiny";
                    case 1: return "small";
                    case 2: return "";
                    case 3: return "large";
                }
            }
        }
    };
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" v-bind:class="sizeClass">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="" :xlink:href="iconPath"></use>
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
    }
</style>

