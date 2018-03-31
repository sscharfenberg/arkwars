<script>
/*******************************************************************************************************************
 * StarSpectral
 * this component displays the spectral class of a star
 ******************************************************************************************************************/
export default {
    props: {
        spectral: {
            type: String,
            required: true
        }
    },
    computed: {
        spectralClassName () { return `spectral--${this.spectral}`; },
        spectralTypeString () { return this.$t("star.spectralType") + ": " + this.spectral; }
    }
};
</script>

<template>
    <div
        class="spectral"
        :class="spectralClassName"
        :aria-label="spectralTypeString"
        :title="spectralTypeString">•</div>
</template>



<style lang="scss" scoped>
    .spectral {
        z-index: z("form");

        height: 48px;
        margin-right: 2rem;
        flex: 0 0 48px;

        background: url("./spectral-types.png") 0 0 no-repeat;
        background-size: 48px;
        border-top-right-radius: 50%;
        border-bottom-right-radius: 50%;

        text-indent: -1000em;

        &--O { background-position: 0 0; }
        &--B { background-position: 0 -48px; }
        &--A { background-position: 0 -96px; }
        &--F { background-position: 0 -144px; }
        &--G { background-position: 0 -192px; }
        &--K { background-position: 0 -240px; }
        &--M { background-position: 0 -288px; }
        &--Y { background-position: 0 -336px; }
    }

</style>
