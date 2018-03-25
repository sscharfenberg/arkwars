<script>
/***********************************************************************************************************************
 * shows a section of the current area including headline
 **********************************************************************************************************************/
export default {
    props: {
        hdl: {
            type: String
        }
    }
};
</script>

<template>
    <section class="screen-section">
        <h2 v-if="hdl">{{ hdl }}</h2>
        <slot>
            Content of the screen section?
        </slot>
    </section>
</template>



<style lang="scss" scoped>
    .screen-section {
        margin: 1rem 0;

        @include respond-to("medium") {
            margin: 2rem 0;
        }
    }

    h2 {
        margin: 0 0 1rem 0;

        color: palette("brand", "viking");

        font-weight: 300;

        @include respond-to("medium") {
            margin: 0 0 2rem 0;
        }
    }
</style>
