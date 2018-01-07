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
            }
        },
        computed: {
            iconPath() {
                return `/public/assets/images/icons-game.svg#${this.name}`;
            }
        }
    };
</script>

<template>
    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="" :xlink:href="iconPath"></use>
    </svg>
</template>

<style lang="scss" scoped>
    svg {
        display: inline-block;

        width: 2.4rem;
        height: 2.4rem;

        fill: currentColor;

        &.small {
            width: 2rem;
            height: 2rem;
        }

        &.tiny {
            width: 1.6rem;
            height: 1.6rem;
        }

        &.large {
            width: 3.2rem;
            height: 3.2rem;
        }
    }
</style>

